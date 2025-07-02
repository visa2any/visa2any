import { NextRequest, NextResponse } from 'next/server'
import { translationService, TranslationRequest, DocumentForTranslation } from '@/lib/translation-service'

// GET - Buscar informações de tradução
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'languages') {
      const languages = translationService.getSupportedLanguages()
      
      return NextResponse.json({
        languages,
        total: Object.keys(languages).length,
        message: 'Idiomas suportados recuperados com sucesso'
      })}

    if (action === 'translators') {
      const sourceLanguage = searchParams.get('sourceLanguage')
      const targetLanguage = searchParams.get('targetLanguage')
      
      const translators = translationService.getAvailableTranslators(
        sourceLanguage || undefined,
        targetLanguage || undefined
      )
      
      return NextResponse.json({
        translators,
        total: translators.length,
        message: translators.length > 0 
          ? `${translators.length} tradutores encontrados` 
          : 'Nenhum tradutor disponível para os idiomas especificados'
      })}

    return NextResponse.json(
      { error: 'Parâmetro action deve ser "languages" ou "translators"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro ao buscar informações de tradução:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }

// POST - Traduzir texto ou documento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'text') {
      // Tradução de texto
      const translationRequest: TranslationRequest = data
      
      // Validação
      if (!translationRequest.text || !translationRequest.sourceLanguage || !translationRequest.targetLanguage) {
        return NextResponse.json(
          { error: 'Campos text, sourceLanguage e targetLanguage são obrigatórios' },
          { status: 400 }
        )
      }

      const result = await translationService.translateText(translationRequest)

      if (result.success) {
        return NextResponse.json({
          translation: {
            originalText: translationRequest.text,
            translatedText: result.translatedText,
            sourceLanguage: translationRequest.sourceLanguage,
            targetLanguage: translationRequest.targetLanguage,
            confidence: result.confidence,
            provider: result.provider,
            cost: result.cost,
            isOfficial: result.isOfficialTranslation,
            certificationNumber: result.certificationNumber
          },
          message: result.isOfficialTranslation 
            ? 'Solicitação de tradução oficial enviada com sucesso'
            : 'Texto traduzido com sucesso'
        })
      } else {
        return NextResponse.json(
          { error: 'Falha na tradução' },
          { status: 400 }
        )
      }

    if (type === 'document') {
      // Tradução de documento
      const documentRequest: DocumentForTranslation = data
      
      // Validação
      const requiredFields = ['fileName', 'sourceLanguage', 'targetLanguage', 'documentType', 'pageCount']
      for (const field of requiredFields) {
        if (!documentRequest[field as keyof DocumentForTranslation]) {
          return NextResponse.json(
            { error: `Campo ${field} é obrigatório para tradução de documento` },
            { status: 400 }
          )
        }
      }

      const result = await translationService.translateDocument(documentRequest)

      if (result.success) {
        return NextResponse.json({
          documentTranslation: {
            translationId: result.translationId,
            estimatedCost: result.estimatedCost,
            estimatedDelivery: result.estimatedDelivery,
            translator: result.translator,
            documentInfo: {
              fileName: documentRequest.fileName,
              pageCount: documentRequest.pageCount,
              isOfficial: documentRequest.isOfficial,
              priority: documentRequest.priority
            }
          },
          message: 'Documento enviado para tradução com sucesso'
        })
      } else {
        return NextResponse.json(
          { error: 'Falha na tradução do documento' },
          { status: 400 }
        )
      }

    return NextResponse.json(
      { error: 'Parâmetro type deve ser "text" ou "document"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro na tradução:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}