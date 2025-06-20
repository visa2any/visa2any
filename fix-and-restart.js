const fs = require('fs')
const { spawn } = require('child_process')

console.log('🔧 Corrigindo problemas e reiniciando servidor...\n')

// 1. Limpar caches
console.log('1️⃣ Limpando todos os caches...')
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true })
    console.log('✅ Cache .next removido')
  }
  
  if (fs.existsSync('node_modules/.cache')) {
    fs.rmSync('node_modules/.cache', { recursive: true, force: true })
    console.log('✅ Cache node_modules removido')
  }
  
  if (fs.existsSync('.turbo')) {
    fs.rmSync('.turbo', { recursive: true, force: true })
    console.log('✅ Cache turbo removido')
  }
} catch (error) {
  console.log('⚠️ Erro ao limpar cache:', error.message)
}

// 2. Verificar arquivo problemático
console.log('\n2️⃣ Verificando arquivo layout.tsx...')
try {
  const layoutContent = fs.readFileSync('src/app/admin/layout.tsx', 'utf8')
  
  // Verificar se tem caracteres estranhos
  const hasInvalidChars = /[^\x00-\x7F]/.test(layoutContent)
  if (hasInvalidChars) {
    console.log('❌ Encontrados caracteres não-ASCII no arquivo')
  } else {
    console.log('✅ Arquivo parece estar limpo')
  }
  
  // Verificar estrutura básica
  if (layoutContent.includes('export default function AdminLayout') && 
      layoutContent.includes('function SidebarContent')) {
    console.log('✅ Estrutura do arquivo correta')
  } else {
    console.log('❌ Estrutura do arquivo pode estar corrompida')
  }
  
} catch (error) {
  console.log('❌ Erro ao verificar arquivo:', error.message)
}

// 3. Instruções para o usuário
console.log('\n3️⃣ Próximos passos:')
console.log('1. Execute: npm run dev')
console.log('2. Aguarde a compilação completa (pode demorar)')
console.log('3. Se ainda houver erro, pare o servidor e execute:')
console.log('   - Ctrl+C para parar')
console.log('   - rm -rf .next && npm run dev')
console.log('\n4️⃣ URLs para testar:')
console.log('🌐 Home: http://localhost:3000')
console.log('👤 Admin: http://localhost:3000/admin/login')
console.log('🔑 Credenciais: admin@visa2any.com / admin123')

console.log('\n✨ Limpeza concluída! Execute npm run dev agora.')

// Verificar se o problema persiste
function checkSyntax() {
  console.log('\n🔍 Verificando sintaxe do TypeScript...')
  
  const tsc = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck'], {
    stdio: 'pipe'
  })
  
  let output = ''
  tsc.stdout.on('data', (data) => {
    output += data.toString()
  })
  
  tsc.stderr.on('data', (data) => {
    output += data.toString()
  })
  
  tsc.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Nenhum erro de TypeScript encontrado')
    } else {
      console.log('❌ Erros de TypeScript encontrados:')
      console.log(output)
    }
  })
}

// Executar verificação de sintaxe (opcional)
// checkSyntax()