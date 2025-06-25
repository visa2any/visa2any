#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('⚡ VALIDAÇÃO RÁPIDA - VISA2ANY');
console.log('='.repeat(50));

let totalErrors = 0;

// Função utilitária para escanear arquivos
function scanFiles(dir, callback) {
  if (!fs.existsSync(dir)) return;
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.includes('node_modules')) {
        scanDir(filePath);
      } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        callback(filePath, content);
      }
    }
  }
  
  scanDir(dir);
}

// 1. VERIFICAR AUTOMATIONLOG
console.log('🔍 1. AutomationLog...');
let automationLogErrors = 0;

scanFiles('./src/app/api', (filePath, content) => {
  if (content.includes('automationLog.create(')) {
    const matches = content.match(/automationLog\.create\([^}]*data:\s*{[^}]*}/g);
    if (matches) {
      matches.forEach(match => {
        if (!match.includes('success:') || !match.includes('details:')) {
          automationLogErrors++;
          console.log(`   ❌ ${filePath} - Faltando campos obrigatórios`);
        }
      });
    }
  }
});

// 2. VERIFICAR JSON CASTING
console.log('🔍 2. JSON Casting...');
let jsonCastingErrors = 0;

scanFiles('./src/app/api', (filePath, content) => {
  if (content.includes(' as any') && 
      (content.includes('details') || content.includes('countries'))) {
    jsonCastingErrors++;
    console.log(`   ⚠️  ${filePath} - Usando 'as any' em JSON`);
  }
});

// 3. VERIFICAR RESPOSTAS SEM MENSAGEM
console.log('🔍 3. Response Format...');
let responseErrors = 0;

scanFiles('./src/app/api', (filePath, content) => {
  if (content.match(/NextResponse\.json\(\s*{\s*status:\s*[45]\d{2}\s*}\s*\)/)) {
    responseErrors++;
    console.log(`   💡 ${filePath} - Resposta de erro sem mensagem`);
  }
});

// 4. VERIFICAR ZOD SEM TRATAMENTO
console.log('🔍 4. Zod Validation...');
let zodErrors = 0;

scanFiles('./src/app/api', (filePath, content) => {
  if (content.includes('.parse(') && !content.includes('z.ZodError')) {
    zodErrors++;
    console.log(`   🔧 ${filePath} - Parse sem tratamento ZodError`);
  }
});

totalErrors = automationLogErrors + jsonCastingErrors + responseErrors + zodErrors;

// RESUMO
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO RÁPIDO:');
console.log(`   🔴 AutomationLog: ${automationLogErrors} erros`);
console.log(`   🟠 JSON Casting: ${jsonCastingErrors} erros`);
console.log(`   🟡 Response: ${responseErrors} erros`);
console.log(`   🟤 Zod: ${zodErrors} erros`);
console.log('='.repeat(50));
console.log(`   🔢 TOTAL: ${totalErrors} erros`);

if (totalErrors === 0) {
  console.log('\n✅ VALIDAÇÃO PASSOU! Deploy liberado!');
  process.exit(0);
} else {
  console.log('\n❌ CORREÇÕES NECESSÁRIAS!');
  console.log('🔧 Execute: npm run fix:auto');
  process.exit(1);
}