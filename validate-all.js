#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 VALIDAÇÃO COMPLETA - VISA2ANY');
console.log('='.repeat(80));
console.log('📋 Verificando TODOS os tipos de erro baseados nas regras de qualidade');
console.log('='.repeat(80));

let totalErrors = 0;
const errors = {
  automationLog: [],
  jsonCasting: [],
  responseFormat: [],
  imports: [],
  syntaxErrors: [],
  zodValidation: [],
  prismaFields: [],
  errorHandling: []
};

// Diretórios para verificar
const apiDir = './src/app/api';
const componentsDir = './src/components';
const libDir = './src/lib';

// 1. VERIFICAR AUTOMATIONLOG.CREATE() - REGRA #1
console.log('\n📋 1. VERIFICANDO AUTOMATIONLOG.CREATE() - REGRA #1...');

function scanAutomationLogErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanAutomationLogErrors(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('automationLog.create(')) {
          // Verificar próximas 15 linhas para success e details
          const nextLines = lines.slice(index, index + 15).join('\n');
          const hasSuccess = nextLines.includes('success:');
          const hasDetails = nextLines.includes('details:');
          
          if (!hasSuccess || !hasDetails) {
            errors.automationLog.push({
              file: filePath,
              line: index + 1,
              missing: `${!hasSuccess ? 'success' : ''} ${!hasDetails ? 'details' : ''}`.trim(),
              severity: 'CRÍTICO'
            });
            totalErrors++;
          }
        }
      });
    }
  });
}

scanAutomationLogErrors(apiDir);

// 2. VERIFICAR JSON CASTING - REGRA #2
console.log('\n📋 2. VERIFICANDO JSON CASTING - REGRA #2...');

function scanJsonCastingErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanJsonCastingErrors(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Detectar 'as any' em contextos JSON
        if (line.includes(' as any') && 
            (line.includes('details') || line.includes('Json') || line.includes('countries'))) {
          errors.jsonCasting.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            severity: 'ALTO'
          });
          totalErrors++;
        }
        
        // Detectar uso direto de JsonArray como índice
        if (line.includes('[') && line.includes(']') && 
            (line.includes('countries') || line.includes('details'))) {
          const hasStringConversion = line.includes('String(') || line.includes('as string');
          if (!hasStringConversion && line.includes('=')) {
            errors.jsonCasting.push({
              file: filePath,
              line: index + 1,
              content: line.trim(),
              issue: 'Possível uso de JsonArray como índice sem conversão',
              severity: 'MÉDIO'
            });
            totalErrors++;
          }
        }
      });
    }
  });
}

scanJsonCastingErrors(apiDir);

// 3. VERIFICAR FORMATO DE RESPOSTA - REGRA #3
console.log('\n📋 3. VERIFICANDO FORMATO DE RESPOSTA - REGRA #3...');

function scanResponseFormatErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanResponseFormatErrors(filePath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Detectar NextResponse.json sem mensagem de erro
        if (line.includes('NextResponse.json') && 
            line.includes('status: 5') && 
            !line.includes('error:') &&
            !line.includes('message:')) {
          errors.responseFormat.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            issue: 'Resposta de erro sem mensagem descritiva',
            severity: 'MÉDIO'
          });
          totalErrors++;
        }
      });
    }
  });
}

scanResponseFormatErrors(apiDir);

// 4. VERIFICAR IMPORTS - REGRA #4
console.log('\n📋 4. VERIFICANDO IMPORTS - REGRA #4...');

function scanImportErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanImportErrors(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar uso inconsistente do Prisma
      if (content.includes('PrismaClient') && content.includes('new PrismaClient()')) {
        errors.imports.push({
          file: filePath,
          issue: 'Criando nova instância do PrismaClient ao invés de usar instância compartilhada',
          solution: 'Use: import { prisma } from "@/lib/prisma"',
          severity: 'MÉDIO'
        });
        totalErrors++;
      }
      
      // Verificar imports relativos problemáticos
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('import') && line.includes('../../../')) {
          errors.imports.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            issue: 'Import relativo muito profundo, use path alias @/',
            severity: 'BAIXO'
          });
          totalErrors++;
        }
      });
    }
  });
}

scanImportErrors(apiDir);

// 5. VERIFICAR ERROS DE SINTAXE - REGRA #8
console.log('\n📋 5. VERIFICANDO ERROS DE SINTAXE - REGRA #8...');

function scanSyntaxErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanSyntaxErrors(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Detectar vírgulas faltando em objetos
        if (line.trim().endsWith('}') && index > 0) {
          const prevLine = lines[index - 1].trim();
          if (prevLine && !prevLine.endsWith(',') && !prevLine.endsWith('{') && 
              !prevLine.endsWith(';') && !prevLine.includes('//')) {
            errors.syntaxErrors.push({
              file: filePath,
              line: index,
              issue: 'Possível vírgula faltando antes de fechar objeto',
              content: prevLine,
              severity: 'ALTO'
            });
            totalErrors++;
          }
        }
        
        // Detectar parênteses não balanceados em funções
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        if (openParens !== closeParens && line.includes('prisma.')) {
          errors.syntaxErrors.push({
            file: filePath,
            line: index + 1,
            issue: 'Parênteses possivelmente não balanceados',
            content: line.trim(),
            severity: 'ALTO'
          });
          totalErrors++;
        }
      });
    }
  });
}

scanSyntaxErrors(apiDir);

// 6. VERIFICAR VALIDAÇÃO ZOD - REGRA #6
console.log('\n📋 6. VERIFICANDO VALIDAÇÃO ZOD - REGRA #6...');

function scanZodValidationErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanZodValidationErrors(filePath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar se usa .parse() mas não trata ZodError
      if (content.includes('.parse(') && !content.includes('z.ZodError')) {
        errors.zodValidation.push({
          file: filePath,
          issue: 'Usando .parse() sem tratamento de ZodError',
          solution: 'Adicione: if (error instanceof z.ZodError)',
          severity: 'MÉDIO'
        });
        totalErrors++;
      }
    }
  });
}

scanZodValidationErrors(apiDir);

// 7. VERIFICAR TRATAMENTO DE ERROS - REGRA #5
console.log('\n📋 7. VERIFICANDO TRATAMENTO DE ERROS - REGRA #5...');

function scanErrorHandlingErrors(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanErrorHandlingErrors(filePath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar se tem try/catch mas não loga erros
      if (content.includes('try {') && content.includes('catch') && 
          !content.includes('console.error') && !content.includes('automationLog.create')) {
        errors.errorHandling.push({
          file: filePath,
          issue: 'Try/catch sem logging adequado de erros',
          solution: 'Adicione console.error e AutomationLog para erros',
          severity: 'MÉDIO'
        });
        totalErrors++;
      }
      
      // Verificar se tem operações async sem try/catch
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('await prisma.') && index > 0) {
          // Verificar se está dentro de try/catch
          const beforeLines = lines.slice(0, index).join('\n');
          const afterLines = lines.slice(index).join('\n');
          
          const tryIndex = beforeLines.lastIndexOf('try {');
          const catchIndex = afterLines.indexOf('} catch');
          
          if (tryIndex === -1 || catchIndex === -1) {
            errors.errorHandling.push({
              file: filePath,
              line: index + 1,
              issue: 'Operação Prisma sem try/catch',
              content: line.trim(),
              severity: 'ALTO'
            });
            totalErrors++;
          }
        }
      });
    }
  });
}

scanErrorHandlingErrors(apiDir);

// RELATÓRIO FINAL
console.log('\n' + '='.repeat(80));
console.log('📊 RELATÓRIO COMPLETO DE VALIDAÇÃO');
console.log('='.repeat(80));

function printErrors(category, errorList, icon) {
  console.log(`\n${icon} ${category.toUpperCase()}:`);
  if (errorList.length === 0) {
    console.log(`   ✅ Nenhum erro encontrado`);
  } else {
    console.log(`   ❌ ${errorList.length} erro(s) encontrado(s):`);
    errorList.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.file}:${error.line || '?'}`);
      console.log(`      💡 ${error.issue || error.missing || 'Campo faltando'}`);
      if (error.content) console.log(`      📝 ${error.content}`);
      if (error.solution) console.log(`      🔧 ${error.solution}`);
      console.log(`      ⚠️  Severidade: ${error.severity}`);
      console.log('');
    });
  }
}

printErrors('AutomationLog Fields', errors.automationLog, '🔴');
printErrors('JSON Casting', errors.jsonCasting, '🟠');
printErrors('Response Format', errors.responseFormat, '🟡');
printErrors('Imports', errors.imports, '🔵');
printErrors('Syntax Errors', errors.syntaxErrors, '🟣');
printErrors('Zod Validation', errors.zodValidation, '🟤');
printErrors('Error Handling', errors.errorHandling, '⚫');

// RESUMO EXECUTIVO
console.log('='.repeat(80));
console.log('📈 RESUMO EXECUTIVO:');
console.log(`   🔴 AutomationLog: ${errors.automationLog.length} erros`);
console.log(`   🟠 JSON Casting: ${errors.jsonCasting.length} erros`);
console.log(`   🟡 Response Format: ${errors.responseFormat.length} erros`);
console.log(`   🔵 Imports: ${errors.imports.length} erros`);
console.log(`   🟣 Syntax: ${errors.syntaxErrors.length} erros`);
console.log(`   🟤 Zod Validation: ${errors.zodValidation.length} erros`);
console.log(`   ⚫ Error Handling: ${errors.errorHandling.length} erros`);
console.log('='.repeat(80));
console.log(`   🔢 TOTAL DE ERROS: ${totalErrors}`);

// CLASSIFICAÇÃO POR SEVERIDADE
const critical = Object.values(errors).flat().filter(e => e.severity === 'CRÍTICO').length;
const high = Object.values(errors).flat().filter(e => e.severity === 'ALTO').length;
const medium = Object.values(errors).flat().filter(e => e.severity === 'MÉDIO').length;
const low = Object.values(errors).flat().filter(e => e.severity === 'BAIXO').length;

console.log(`\n📊 POR SEVERIDADE:`);
console.log(`   🚨 CRÍTICO: ${critical} (Bloqueia deploy)`);
console.log(`   ⚠️  ALTO: ${high} (Pode causar runtime errors)`);
console.log(`   ⚡ MÉDIO: ${medium} (Problemas de qualidade)`);
console.log(`   💡 BAIXO: ${low} (Melhorias)`);

// AÇÕES RECOMENDADAS
console.log(`\n🎯 AÇÕES RECOMENDADAS:`);
if (critical > 0) {
  console.log(`   🚨 URGENTE: Corrigir ${critical} erro(s) crítico(s) antes do deploy!`);
}
if (high > 0) {
  console.log(`   ⚠️  IMPORTANTE: Corrigir ${high} erro(s) de alta severidade`);
}
if (medium > 0) {
  console.log(`   ⚡ RECOMENDADO: Corrigir ${medium} erro(s) de qualidade`);
}

console.log(`\n📚 CONSULTE: ./REGRAS-TYPESCRIPT-QUALIDADE.md para detalhes das regras`);

// STATUS FINAL
if (totalErrors === 0) {
  console.log('\n🎉 ✅ TODOS OS CRITÉRIOS ATENDIDOS! Deploy liberado!');
  process.exit(0);
} else {
  console.log(`\n❌ ${totalErrors} ERRO(S) ENCONTRADO(S) - Deploy bloqueado!`);
  console.log('🔧 Execute as correções necessárias antes de prosseguir.');
  process.exit(1);
}