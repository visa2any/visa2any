import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

// Configuração de storage local (custo-benefício)
const STORAGE_BASE_PATH = process.env.STORAGE_PATH || './uploads'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']

export interface UploadOptions {
  filename?: string
  subfolder?: string
  generateThumbnail?: boolean
  encrypt?: boolean
}

export interface StorageFile {
  id: string
  originalName: string
  filename: string
  path: string
  size: number
  mimetype: string
  hash: string
  uploadedAt: Date
  url: string
}

// Garantir que diretório de uploads existe
async function ensureUploadDir(subfolder?: string) {
  const fullPath = subfolder 
    ? path.join(STORAGE_BASE_PATH, subfolder)
    : STORAGE_BASE_PATH

  try {
    await fs.access(fullPath)
  } catch {
    await fs.mkdir(fullPath, { recursive: true })
  }

  return fullPath
}

// Validar arquivo
function validateFile(buffer: Buffer, originalName: string) {
  // Verificar tamanho
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`Arquivo muito grande. Máximo permitido: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Verificar extensão
  const ext = path.extname(originalName).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Tipo de arquivo não permitido. Permitidos: ${ALLOWED_EXTENSIONS.join(', ')}`)
  }

  // Verificar assinatura do arquivo (magic bytes)
  const magicBytes = buffer.slice(0, 4).toString('hex')
  const validMagicBytes = {
    '25504446': 'pdf',
    'ffd8ffe0': 'jpg',
    'ffd8ffe1': 'jpg',
    'ffd8ffe2': 'jpg',
    'ffd8ffe3': 'jpg',
    'ffd8ffe8': 'jpg',
    '89504e47': 'png',
    'd0cf11e0': 'doc',
    '504b0304': 'docx'
  }

  const detectedType = validMagicBytes[magicBytes]
  if (!detectedType) {
    // Verificar se pelo menos é uma imagem ou PDF válido
    const jpegStart = buffer.slice(0, 2).toString('hex')
    const pngStart = buffer.slice(0, 8).toString('hex')
    
    if (jpegStart !== 'ffd8' && pngStart !== '89504e470d0a1a0a' && magicBytes !== '25504446') {
      throw new Error('Arquivo pode estar corrompido ou não é um tipo válido')
    }
  }

  return true
}

// Gerar hash do arquivo
function generateFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

// Upload de arquivo local
export async function uploadFile(
  buffer: Buffer, 
  originalName: string, 
  options: UploadOptions = {}
): Promise<StorageFile> {
  try {
    // Validar arquivo
    validateFile(buffer, originalName)

    // Preparar paths
    const uploadDir = await ensureUploadDir(options.subfolder)
    const fileId = uuidv4()
    const ext = path.extname(originalName)
    const filename = options.filename || `${fileId}${ext}`
    const filePath = path.join(uploadDir, filename)

    // Gerar hash para detecção de duplicatas
    const hash = generateFileHash(buffer)

    // Verificar se arquivo já existe (por hash)
    try {
      const metadataPath = path.join(uploadDir, '.metadata.json')
      let metadata = {}
      
      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf-8')
        metadata = JSON.parse(metadataContent)
      } catch {
        // Metadata não existe ainda
      }

      // Verificar duplicata
      for (const [existingId, file] of Object.entries(metadata as Record<string, any>)) {
        if (file.hash === hash) {
          // Arquivo já existe, retornar referência existente
          return {
            id: existingId,
            originalName: file.originalName,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            hash: file.hash,
            uploadedAt: new Date(file.uploadedAt),
            url: `/api/files/${options.subfolder ? options.subfolder + '/' : ''}${file.filename}`
          }
        }
      }
    } catch (duplicateError) {
      // Ignorar erro de verificação de duplicata
    }

    // Criptografar arquivo se solicitado
    let fileBuffer = buffer
    if (options.encrypt) {
      const key = process.env.FILE_ENCRYPTION_KEY || 'default-key-change-this'
      const cipher = crypto.createCipher('aes192', key)
      const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()])
      fileBuffer = encrypted
    }

    // Salvar arquivo
    await fs.writeFile(filePath, fileBuffer)

    // Detectar MIME type
    const mimetype = getMimeType(originalName)

    // Criar registro do arquivo
    const fileRecord: StorageFile = {
      id: fileId,
      originalName,
      filename,
      path: filePath,
      size: buffer.length,
      mimetype,
      hash,
      uploadedAt: new Date(),
      url: `/api/files/${options.subfolder ? options.subfolder + '/' : ''}${filename}`
    }

    // Salvar metadata
    await saveFileMetadata(uploadDir, fileId, fileRecord)

    // Gerar thumbnail se for imagem
    if (options.generateThumbnail && mimetype.startsWith('image/')) {
      try {
        await generateThumbnail(filePath, uploadDir, fileId)
      } catch (thumbError) {
        console.warn('Erro ao gerar thumbnail:', thumbError.message)
      }
    }

    return fileRecord

  } catch (error) {
    throw new Error(`Erro no upload: ${error.message}`)
  }
}

// Salvar metadata do arquivo
async function saveFileMetadata(uploadDir: string, fileId: string, fileRecord: StorageFile) {
  const metadataPath = path.join(uploadDir, '.metadata.json')
  
  let metadata = {}
  try {
    const content = await fs.readFile(metadataPath, 'utf-8')
    metadata = JSON.parse(content)
  } catch {
    // Arquivo não existe ainda
  }

  metadata[fileId] = fileRecord
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
}

// Obter arquivo
export async function getFile(fileId: string, subfolder?: string): Promise<StorageFile | null> {
  try {
    const uploadDir = path.join(STORAGE_BASE_PATH, subfolder || '')
    const metadataPath = path.join(uploadDir, '.metadata.json')
    
    const content = await fs.readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(content)
    
    const fileRecord = metadata[fileId]
    if (!fileRecord) return null

    // Verificar se arquivo físico ainda existe
    try {
      await fs.access(fileRecord.path)
      return {
        ...fileRecord,
        uploadedAt: new Date(fileRecord.uploadedAt)
      }
    } catch {
      // Arquivo foi deletado fisicamente
      delete metadata[fileId]
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
      return null
    }
  } catch {
    return null
  }
}

// Ler conteúdo do arquivo
export async function readFile(fileId: string, subfolder?: string): Promise<Buffer | null> {
  try {
    const fileRecord = await getFile(fileId, subfolder)
    if (!fileRecord) return null

    let buffer = await fs.readFile(fileRecord.path)

    // Descriptografar se necessário
    if (process.env.FILE_ENCRYPTION_KEY && fileRecord.path.includes('.encrypted')) {
      const key = process.env.FILE_ENCRYPTION_KEY
      const decipher = crypto.createDecipher('aes192', key)
      buffer = Buffer.concat([decipher.update(buffer), decipher.final()])
    }

    return buffer
  } catch {
    return null
  }
}

// Deletar arquivo
export async function deleteFile(fileId: string, subfolder?: string): Promise<boolean> {
  try {
    const fileRecord = await getFile(fileId, subfolder)
    if (!fileRecord) return false

    // Deletar arquivo físico
    try {
      await fs.unlink(fileRecord.path)
    } catch {
      // Arquivo já foi deletado
    }

    // Remover metadata
    const uploadDir = path.join(STORAGE_BASE_PATH, subfolder || '')
    const metadataPath = path.join(uploadDir, '.metadata.json')
    
    const content = await fs.readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(content)
    delete metadata[fileId]
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))

    return true
  } catch {
    return false
  }
}

// Listar arquivos
export async function listFiles(subfolder?: string): Promise<StorageFile[]> {
  try {
    const uploadDir = path.join(STORAGE_BASE_PATH, subfolder || '')
    const metadataPath = path.join(uploadDir, '.metadata.json')
    
    const content = await fs.readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(content)
    
    return Object.values(metadata).map(file => ({
      ...file,
      uploadedAt: new Date(file.uploadedAt)
    }))
  } catch {
    return []
  }
}

// Gerar thumbnail (opcional, requer sharp)
async function generateThumbnail(filePath: string, uploadDir: string, fileId: string) {
  try {
    // Tentar usar sharp se disponível
    const sharp = require('sharp')
    const thumbnailPath = path.join(uploadDir, 'thumbnails', `${fileId}_thumb.jpg`)
    
    await fs.mkdir(path.dirname(thumbnailPath), { recursive: true })
    
    await sharp(filePath)
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath)
      
    return thumbnailPath
  } catch (error) {
    // Sharp não disponível ou erro na geração
    throw new Error('Thumbnail generation failed')
  }
}

// Detectar MIME type
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}

// Limpeza de arquivos antigos (opcional)
export async function cleanupOldFiles(daysOld: number = 30, subfolder?: string) {
  try {
    const files = await listFiles(subfolder)
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
    
    let deletedCount = 0
    for (const file of files) {
      if (file.uploadedAt < cutoffDate) {
        const deleted = await deleteFile(file.id, subfolder)
        if (deleted) deletedCount++
      }
    }
    
    return { deletedCount, totalFiles: files.length }
  } catch (error) {
    throw new Error(`Erro na limpeza: ${error.message}`)
  }
}

// Backup para nuvem (opcional, caso queira implementar depois)
export async function backupToCloud(fileId: string, subfolder?: string) {
  try {
    // Implementar backup para S3, Google Cloud, etc. quando necessário
    // Por enquanto, apenas log
    console.log(`Backup solicitado para arquivo ${fileId} em ${subfolder || 'root'}`)
    return { success: true, backupLocation: 'local-only' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}