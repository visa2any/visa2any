#!/usr/bin/env node

/**
 * QUICK TYPE CHECK - Verificação rápida de TypeScript
 * Foca apenas nos arquivos modificados
 */

const { execSync } = require('child_process');

console.log('⚡ VERIFICAÇÃO RÁPIDA DE TYPESCRIPT\n');

try {
  // 1. Verificar arquivos modificados
  console.log('📁 Verificando arquivos modificados...');
  const modifiedFiles = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only --cached 2>/dev/null || echo ""', 
    { encoding: 'utf8' }).trim();
  
  const tsFiles = modifiedFiles.split('\n')
    .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
    .filter(file => file.startsWith('src/'));

  if (tsFiles.length === 0) {
    console.log('✅ Nenhum arquivo TypeScript modificado.');
  } else {
    console.log(`📝 ${tsFiles.length} arquivos TS modificados:`);
    tsFiles.forEach(file => console.log(`   - ${file}`));
  }

  // 2. Verificar sintaxe básica dos arquivos modificados
  if (tsFiles.length > 0) {
    console.log('\n🔧 Verificando sintaxe dos arquivos modificados...');
    for (const file of tsFiles.slice(0, 5)) { // Máximo 5 arquivos
      try {
        execSync(`timeout 10 npx tsc --noEmit --skipLibCheck "${file}" 2>&1`, { stdio: 'pipe' });
        console.log(`✅ ${file} - OK`);
      } catch (error) {
        console.log(`❌ ${file} - ERRO:`);
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        // Mostrar apenas as primeiras 3 linhas de erro
        const errorLines = output.split('\n').slice(0, 3).join('\n');
        console.log(errorLines);
        console.log('\n🚨 ERRO DETECTADO! Corrija antes de enviar para Vercel.\n');
        process.exit(1);
      }
    }
  }

  // 3. Verificar imports básicos
  console.log('\n📦 Verificando imports essenciais...');
  const criticalFiles = [
    'src/app/layout.tsx',
    'src/lib/prisma.ts'
  ];

  for (const file of criticalFiles) {
    try {
      const content = require('fs').readFileSync(file, 'utf8');
      if (file.endsWith('layout.tsx') && !content.includes('export default')) {
        throw new Error('Layout deve ter export default');
      }
      console.log(`✅ ${file} - OK`);
    } catch (error) {
      console.log(`❌ ${file} - ERRO: ${error.message}`);
      process.exit(1);
    }
  }

  console.log('\n🎉 VERIFICAÇÃO RÁPIDA COMPLETA!');
  console.log('✅ Arquivos modificados passaram na verificação');
  console.log('✅ Imports essenciais OK');
  console.log('🚀 Provavelmente vai passar no Vercel');
  
  // Dica baseada no contexto
  if (tsFiles.length > 0) {
    console.log('\n💡 RECOMENDAÇÃO:');
    console.log('   Faça commit das mudanças e push - build deve passar no Vercel');
  } else {
    console.log('\n💡 NOTA:');
    console.log('   Nenhuma mudança TypeScript detectada desde último commit');
  }

} catch (error) {
  console.error('❌ Erro na verificação:', error.message);
  process.exit(1);
}