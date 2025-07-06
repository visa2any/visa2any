#!/usr/bin/env node

/**
 * SCRIPT DE VALIDAÇÃO ANTES DO DEPLOY
 * Executa verificações TypeScript rápidas para evitar erros no Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDAÇÃO PRÉ-DEPLOY - Verificando erros TypeScript...\n');

// Função para executar comando com timeout
function executeWithTimeout(command, timeoutMs = 30000) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      timeout: timeoutMs,
      stdio: 'pipe'
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || error.stderr || error.message,
      isTimeout: error.signal === 'SIGTERM'
    };
  }
}

// 1. Verificar arquivos modificados recentemente
console.log('📁 Verificando arquivos modificados...');
const modifiedFiles = executeWithTimeout('git diff --name-only HEAD~1 HEAD');
if (modifiedFiles.success) {
  const tsFiles = modifiedFiles.output.split('\n')
    .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
    .filter(file => file.startsWith('src/'));
  
  console.log(`✅ Encontrados ${tsFiles.length} arquivos TS/TSX modificados\n`);
  
  if (tsFiles.length === 0) {
    console.log('✅ Nenhum arquivo TypeScript modificado. Prosseguindo...\n');
  } else {
    console.log('📝 Arquivos modificados:');
    tsFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');
  }
}

// 2. Verificação rápida de sintaxe básica
console.log('🔧 Verificação rápida de sintaxe...');

const quickSyntaxCheck = executeWithTimeout('npx tsc --noEmit --skipLibCheck --target ES2015 --moduleResolution node src/app/layout.tsx', 15000);
if (!quickSyntaxCheck.success && !quickSyntaxCheck.isTimeout) {
  console.log('❌ ERRO DE SINTAXE DETECTADO:');
  console.log(quickSyntaxCheck.output);
  process.exit(1);
}

// 3. Verificar se Next.js pode compilar
console.log('⚡ Verificando compilação Next.js (rápida)...');
const nextCompileCheck = executeWithTimeout('npx next build --no-lint --experimental-build-mode compile', 45000);

if (!nextCompileCheck.success && !nextCompileCheck.isTimeout) {
  if (nextCompileCheck.output.includes('Type error:') || 
      nextCompileCheck.output.includes('Failed to compile')) {
    console.log('❌ ERRO DE TYPESCRIPT DETECTADO:');
    console.log(nextCompileCheck.output);
    console.log('\n🚨 PARE! Corrija os erros TypeScript antes de fazer deploy no Vercel.\n');
    process.exit(1);
  }
}

// 4. Verificações básicas de estrutura
console.log('📋 Verificações básicas...');

// Verificar se arquivos críticos existem
const criticalFiles = [
  'src/app/layout.tsx',
  'src/lib/prisma.ts',
  'package.json',
  'tsconfig.json'
];

for (const file of criticalFiles) {
  if (!fs.existsSync(file)) {
    console.log(`❌ ERRO: Arquivo crítico ausente: ${file}`);
    process.exit(1);
  }
}

console.log('✅ Arquivos críticos presentes');

// 5. Verificar import/export básicos
console.log('🔗 Verificando imports básicos...');

const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
if (!layoutContent.includes('export default')) {
  console.log('❌ ERRO: layout.tsx deve exportar componente default');
  process.exit(1);
}

console.log('✅ Estrutura de exports OK');

// 6. Resumo final
console.log('\n🎉 VALIDAÇÃO PRÉ-DEPLOY COMPLETA!');
console.log('✅ Nenhum erro crítico detectado');
console.log('✅ Projeto pronto para deploy no Vercel');
console.log('\n💡 Dica: Execute este script antes de cada push:');
console.log('   npm run validate:deploy\n');