#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 VERIFICAÇÃO COMPLETA DE ERROS TYPESCRIPT - VISA2ANY');
console.log('='.repeat(60));

// 1. Encontrar todos os arquivos com AutomationLog.create()
console.log('\n📋 1. VERIFICANDO AUTOMATIONLOG.CREATE() CALLS...');

const apiDir = './src/app/api';
const automationLogFiles = [];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('automationLog.create(')) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('automationLog.create(')) {
            // Verificar se tem success e details
            const nextLines = lines.slice(index, index + 10).join('\n');
            const hasSuccess = nextLines.includes('success:');
            const hasDetails = nextLines.includes('details:');
            
            if (!hasSuccess || !hasDetails) {
              automationLogFiles.push({
                file: filePath,
                line: index + 1,
                hasSuccess,
                hasDetails
              });
            }
          }
        });
      }
    }
  });
}

scanDirectory(apiDir);

console.log(`❌ Encontrados ${automationLogFiles.length} erros de AutomationLog:`);
automationLogFiles.forEach(error => {
  console.log(`   ${error.file}:${error.line} - Faltando: ${!error.hasSuccess ? 'success' : ''} ${!error.hasDetails ? 'details' : ''}`);
});

// 2. Verificar tipos JSON problemáticos
console.log('\n📋 2. VERIFICANDO TIPOS JSON...');

const jsonErrors = [];

function scanForJsonErrors(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanForJsonErrors(filePath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes(' as any') && (line.includes('details') || line.includes('Json'))) {
          jsonErrors.push({
            file: filePath,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    }
  });
}

scanForJsonErrors(apiDir);

console.log(`⚠️  Encontrados ${jsonErrors.length} problemas de casting JSON:`);
jsonErrors.forEach(error => {
  console.log(`   ${error.file}:${error.line} - ${error.content}`);
});

// 3. Verificar imports problemáticos
console.log('\n📋 3. VERIFICANDO IMPORTS...');

const importErrors = [];

function scanForImportErrors(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanForImportErrors(filePath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('from \'@/lib/prisma\'') && content.includes('PrismaClient')) {
        importErrors.push({
          file: filePath,
          issue: 'Usando PrismaClient ao invés de prisma instance'
        });
      }
    }
  });
}

scanForImportErrors(apiDir);

console.log(`🔗 Encontrados ${importErrors.length} problemas de import:`);
importErrors.forEach(error => {
  console.log(`   ${error.file} - ${error.issue}`);
});

// 4. RESUMO
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DOS PROBLEMAS ENCONTRADOS:');
console.log(`   ❌ AutomationLog sem campos obrigatórios: ${automationLogFiles.length}`);
console.log(`   ⚠️  Problemas de casting JSON: ${jsonErrors.length}`);
console.log(`   🔗 Problemas de import: ${importErrors.length}`);
console.log(`   🔢 TOTAL DE ERROS: ${automationLogFiles.length + jsonErrors.length + importErrors.length}`);

if (automationLogFiles.length > 0 || jsonErrors.length > 0 || importErrors.length > 0) {
  console.log('\n❌ AÇÃO NECESSÁRIA: Corrigir todos os erros antes do deploy!');
  process.exit(1);
} else {
  console.log('\n✅ TODOS OS ERROS FORAM CORRIGIDOS!');
  process.exit(0);
}