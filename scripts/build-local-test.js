#!/usr/bin/env node

/**
 * BUILD LOCAL TEST - Verificação completa antes do Vercel
 * Executa build completo local para garantir sucesso no Vercel
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🏗️  BUILD LOCAL TEST - Garantindo sucesso no Vercel...\n');

// Função para executar comando com output em tempo real
function executeCommand(command, timeoutMs = 300000) {
  return new Promise((resolve, reject) => {
    console.log(`▶️  Executando: ${command}`);
    
    const child = spawn('bash', ['-c', command], {
      stdio: 'inherit',
      timeout: timeoutMs
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, code });
      } else {
        reject({ success: false, code, error: `Command failed with exit code ${code}` });
      }
    });

    child.on('error', (error) => {
      reject({ success: false, error: error.message });
    });
  });
}

async function runLocalBuild() {
  try {
    // 1. Verificar se temos arquivos modificados
    console.log('📋 1. Verificando status do Git...');
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        console.log('⚠️  Arquivos modificados detectados:');
        console.log(gitStatus);
        console.log('⚠️  Recomendado fazer commit antes do build.\n');
      } else {
        console.log('✅ Repositório limpo.\n');
      }
    } catch (e) {
      console.log('⚠️  Não foi possível verificar git status.\n');
    }

    // 2. Limpar cache do Next.js
    console.log('🧹 2. Limpando cache...');
    try {
      execSync('rm -rf .next', { stdio: 'pipe' });
      console.log('✅ Cache .next removido.');
    } catch (e) {
      console.log('⚠️  Cache já estava limpo.');
    }
    
    try {
      execSync('rm -rf node_modules/.cache', { stdio: 'pipe' });
      console.log('✅ Cache node_modules limpo.');
    } catch (e) {
      console.log('⚠️  Cache node_modules já estava limpo.');
    }
    console.log('');

    // 3. Gerar Prisma Client
    console.log('🔧 3. Gerando Prisma Client...');
    await executeCommand('npx prisma generate', 60000);
    console.log('✅ Prisma Client gerado com sucesso.\n');

    // 4. Executar build completo do Next.js
    console.log('🏗️  4. Executando build completo do Next.js...');
    console.log('⏱️  Isso pode levar alguns minutos...\n');
    
    await executeCommand('npx next build', 600000); // 10 minutos timeout
    
    console.log('\n🎉 BUILD LOCAL COMPLETO COM SUCESSO!');
    console.log('✅ Todos os arquivos TypeScript compilaram corretamente');
    console.log('✅ Build otimizado criado em .next/');
    console.log('✅ Projeto 100% pronto para deploy no Vercel');
    
    // 5. Verificar saída do build
    console.log('\n📊 5. Verificando arquivos gerados...');
    if (fs.existsSync('.next/static')) {
      console.log('✅ Arquivos estáticos gerados');
    }
    if (fs.existsSync('.next/server')) {
      console.log('✅ Arquivos do servidor gerados');
    }
    
    console.log('\n🚀 PRONTO PARA VERCEL!');
    console.log('💡 Agora você pode fazer push que o build passará no Vercel.');
    
    return true;

  } catch (error) {
    console.log('\n❌ BUILD FALHOU!');
    console.log('🚨 ERROS DETECTADOS que precisam ser corrigidos:');
    console.log(error.error || error.message);
    console.log('\n🛠️  Corrija os erros acima antes de fazer deploy no Vercel.');
    
    return false;
  }
}

// Executar build
runLocalBuild().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Erro inesperado:', error);
  process.exit(1);
});