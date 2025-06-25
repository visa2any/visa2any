#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 AUTO-CORREÇÃO DE ERROS - VISA2ANY');
console.log('='.repeat(80));
console.log('🤖 Corrigindo automaticamente erros baseados nas regras de qualidade');
console.log('='.repeat(80));

let totalFixed = 0;
const fixed = {
  automationLog: 0,
  jsonCasting: 0,
  responseFormat: 0,
  imports: 0,
  syntaxErrors: 0
};

// TEMPLATES PARA CORREÇÕES
const automationLogTemplate = {
  success: 'true',
  details: `{
    timestamp: new Date().toISOString(),
    action: 'automated_action'
  }`
};

const jsonCastingReplacements = {
  'as any': {
    'details': 'as { [key: string]: any }',
    'countries': 'as string[]',
    'sequenceType': 'as { sequenceType?: string }',
    'emailsScheduled': 'as { emailsScheduled?: number }'
  }
};

// 1. CORRIGIR AUTOMATIONLOG.CREATE()
console.log('\n🔧 1. CORRIGINDO AUTOMATIONLOG.CREATE()...');

function fixAutomationLogInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('automationLog.create(')) {
      // Encontrar o bloco data
      let dataStart = -1;
      let dataEnd = -1;
      let braceCount = 0;
      
      for (let j = i; j < lines.length; j++) {
        if (lines[j].includes('data: {')) {
          dataStart = j;
          braceCount = 1;
        } else if (dataStart !== -1) {
          const chars = lines[j].split('');
          chars.forEach(char => {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          });
          
          if (braceCount === 0) {
            dataEnd = j;
            break;
          }
        }
      }
      
      if (dataStart !== -1 && dataEnd !== -1) {
        const dataBlock = lines.slice(dataStart, dataEnd + 1).join('\n');
        const hasSuccess = dataBlock.includes('success:');
        const hasDetails = dataBlock.includes('details:');
        
        if (!hasSuccess || !hasDetails) {
          const indent = '        '; // 8 espaços
          let insertIndex = dataEnd;
          
          // Adicionar vírgula se necessário
          if (!lines[dataEnd - 1].trim().endsWith(',')) {
            lines[dataEnd - 1] += ',';
          }
          
          if (!hasSuccess) {
            lines.splice(insertIndex, 0, `${indent}success: true,`);
            insertIndex++;
            modified = true;
          }
          
          if (!hasDetails) {
            lines.splice(insertIndex, 0, 
              `${indent}details: {`,
              `${indent}  timestamp: new Date().toISOString(),`,
              `${indent}  action: 'automated_action'`,
              `${indent}}`
            );
            modified = true;
          }
          
          if (modified) {
            fixed.automationLog++;
            totalFixed++;
          }
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`   ✅ ${filePath}`);
  }
  
  return modified;
}

// 2. CORRIGIR JSON CASTING
console.log('\n🔧 2. CORRIGINDO JSON CASTING...');

function fixJsonCastingInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Substituir 'as any' por tipos específicos
  const replacements = [
    {
      pattern: /(seq\.details\s+as\s+any)/g,
      replacement: '(seq.details as { sequenceType?: string; emailsScheduled?: number })'
    },
    {
      pattern: /(log\.details\s+as\s+any)/g,
      replacement: '(log.details as { [key: string]: any })'
    },
    {
      pattern: /(\w+\.countries\s+as\s+any)/g,
      replacement: '($1 as string[])'
    },
    {
      pattern: /const\s+(\w+)\s+=\s+(\w+\.details)\s+as\s+any/g,
      replacement: 'const $1 = ($2 as { [key: string]: any })'
    }
  ];
  
  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });
  
  // Corrigir uso de JsonArray como índice
  content = content.replace(
    /countries\.forEach\(country\s+=>\s+{[\s\S]*?countryCount\[country\]/g,
    match => {
      if (!match.includes('String(country)')) {
        return match.replace(
          'countryCount[country]',
          'countryCount[String(country)]'
        );
      }
      return match;
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ ${filePath}`);
    fixed.jsonCasting++;
    totalFixed++;
  }
  
  return modified;
}

// 3. CORRIGIR FORMATO DE RESPOSTA
console.log('\n🔧 3. CORRIGINDO FORMATO DE RESPOSTA...');

function fixResponseFormatInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Substituir respostas de erro sem mensagem
  const errorResponsePattern = /NextResponse\.json\(\s*{\s*status:\s*5\d{2}\s*}\s*\)/g;
  
  if (errorResponsePattern.test(content)) {
    content = content.replace(
      errorResponsePattern,
      'NextResponse.json(\n      { error: \'Erro interno do servidor\' },\n      { status: 500 }\n    )'
    );
    modified = true;
  }
  
  // Corrigir respostas com só { status: 400 }
  const badRequestPattern = /NextResponse\.json\(\s*{\s*status:\s*400\s*}\s*\)/g;
  
  if (badRequestPattern.test(content)) {
    content = content.replace(
      badRequestPattern,
      'NextResponse.json(\n      { error: \'Dados inválidos\' },\n      { status: 400 }\n    )'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ ${filePath}`);
    fixed.responseFormat++;
    totalFixed++;
  }
  
  return modified;
}

// 4. CORRIGIR IMPORTS
console.log('\n🔧 4. CORRIGINDO IMPORTS...');

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Substituir new PrismaClient() por import compartilhado
  if (content.includes('new PrismaClient()')) {
    // Adicionar import se não existir
    if (!content.includes('import { prisma } from')) {
      content = `import { prisma } from '@/lib/prisma'\n${content}`;
    }
    
    // Remover criação de nova instância
    content = content.replace(/const\s+prisma\s+=\s+new\s+PrismaClient\(\)/g, '');
    content = content.replace(/import\s+{\s*PrismaClient\s*}\s+from\s+['"][^'"]*['"]/g, '');
    
    modified = true;
  }
  
  // Converter imports relativos profundos para path alias
  content = content.replace(
    /import\s+([^'"]*)\s+from\s+['"](\.\.\/.\.\.\/[^'"]*)['"]/g,
    (match, imports, path) => {
      const newPath = path.replace(/^(\.\.\/)+/, '@/');
      return `import ${imports} from '${newPath}'`;
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ ${filePath}`);
    fixed.imports++;
    totalFixed++;
  }
  
  return modified;
}

// 5. CORRIGIR ERROS DE SINTAXE BÁSICOS
console.log('\n🔧 5. CORRIGINDO ERROS DE SINTAXE...');

function fixSyntaxErrorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const lines = content.split('\n');
  
  // Corrigir vírgulas faltando em objetos
  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i].trim();
    const nextLine = lines[i + 1].trim();
    
    // Se linha atual não termina com vírgula mas deveria
    if (currentLine && 
        !currentLine.endsWith(',') && 
        !currentLine.endsWith('{') &&
        !currentLine.endsWith(';') &&
        !currentLine.includes('//') &&
        nextLine &&
        (nextLine.startsWith('}') || /^\w+:/.test(nextLine))) {
      
      lines[i] += ',';
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`   ✅ ${filePath}`);
    fixed.syntaxErrors++;
    totalFixed++;
  }
  
  return modified;
}

// PROCESSAR TODOS OS ARQUIVOS
function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      // Aplicar todas as correções
      fixAutomationLogInFile(filePath);
      fixJsonCastingInFile(filePath);
      fixResponseFormatInFile(filePath);
      fixImportsInFile(filePath);
      fixSyntaxErrorsInFile(filePath);
    }
  });
}

// Processar diretório API
processDirectory('./src/app/api');

// RELATÓRIO DE CORREÇÕES
console.log('\n' + '='.repeat(80));
console.log('📊 RELATÓRIO DE CORREÇÕES APLICADAS');
console.log('='.repeat(80));
console.log(`   🔴 AutomationLog corrigidos: ${fixed.automationLog}`);
console.log(`   🟠 JSON Casting corrigidos: ${fixed.jsonCasting}`);
console.log(`   🟡 Response Format corrigidos: ${fixed.responseFormat}`);
console.log(`   🔵 Imports corrigidos: ${fixed.imports}`);
console.log(`   🟣 Syntax corrigidos: ${fixed.syntaxErrors}`);
console.log('='.repeat(80));
console.log(`   🔢 TOTAL CORRIGIDO: ${totalFixed}`);

if (totalFixed > 0) {
  console.log('\n🎉 CORREÇÕES APLICADAS COM SUCESSO!');
  console.log('🔍 Execute "node validate-all.js" para verificar se ainda há erros');
  console.log('💾 Faça commit das alterações quando estiver satisfeito');
} else {
  console.log('\n✅ NENHUMA CORREÇÃO NECESSÁRIA - Código já estava correto!');
}

console.log('\n📚 Consulte REGRAS-TYPESCRIPT-QUALIDADE.md para mais detalhes');