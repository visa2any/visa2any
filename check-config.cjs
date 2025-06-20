#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do projeto...\n');

// Verifica tsconfig.json
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  const hasPaths = tsconfig.compilerOptions && tsconfig.compilerOptions.paths;
  const hasBaseUrl = tsconfig.compilerOptions && tsconfig.compilerOptions.baseUrl;
  
  console.log('✅ tsconfig.json encontrado');
  console.log(`✅ baseUrl configurado: ${hasBaseUrl ? '✓' : '✗'}`);
  console.log(`✅ paths configurado: ${hasPaths ? '✓' : '✗'}`);
  
  if (hasPaths && tsconfig.compilerOptions.paths['@/*']) {
    console.log(`✅ Alias @ aponta para: ${tsconfig.compilerOptions.paths['@/*'][0]}`);
  }
} catch (error) {
  console.log('❌ Erro ao ler tsconfig.json:', error.message);
}

// Verifica se os componentes existem
const componentsDir = path.join('src', 'components');
const uiDir = path.join('src', 'components', 'ui');

console.log(`\n📁 Estrutura de arquivos:`);
console.log(`✅ src/components: ${fs.existsSync(componentsDir) ? '✓' : '✗'}`);
console.log(`✅ src/components/ui: ${fs.existsSync(uiDir) ? '✓' : '✗'}`);
console.log(`✅ button.tsx: ${fs.existsSync(path.join(uiDir, 'button.tsx')) ? '✓' : '✗'}`);

// Verifica arquivos de configuração
console.log(`\n⚙️  Arquivos de configuração:`);
console.log(`✅ postcss.config.cjs: ${fs.existsSync('postcss.config.cjs') ? '✓' : '✗'}`);
console.log(`✅ tailwind.config.cjs: ${fs.existsSync('tailwind.config.cjs') ? '✓' : '✗'}`);
console.log(`✅ tsconfig.json: ${fs.existsSync('tsconfig.json') ? '✓' : '✗'}`);

// Verifica package.json
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`\n📦 Next.js versão: ${pkg.dependencies.next}`);
  console.log(`📦 React versão: ${pkg.dependencies.react}`);
  console.log(`📦 TypeScript versão: ${pkg.dependencies.typescript}`);
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

console.log('\n🎉 Configuração verificada! Execute:');
console.log('   npm run dev:node');
console.log('   ou');
console.log('   start-dev.bat');
console.log('\nDepois acesse: http://localhost:3000');