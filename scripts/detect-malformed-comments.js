#!/usr/bin/env node

/**
 * 🚨 DETECTOR DE COMENTÁRIOS PORTUGUESES MALFORMADOS
 * 
 * Este script detecta o padrão crítico que quebra builds:
 * // comment, code
 * 
 * Baseado nos erros resolvidos em 2025-06-27
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Padrões críticos que quebram o parser TypeScript/JSX
const CRITICAL_PATTERNS = [
  {
    name: 'Comentário com código na mesma linha',
    regex: /\/\/[^,\n]+,\s+([a-zA-Z<].*)/g,
    description: 'Comentário português seguido de vírgula e código na mesma linha'
  },
  {
    name: 'Comentário com const/function',
    regex: /\/\/.*,\s+(const|function|if|useEffect|<)/g,
    description: 'Comentário com declaração de código na mesma linha'
  },
  {
    name: 'Comentário com JSX',
    regex: /\/\/.*,\s+</g,
    description: 'Comentário com elemento JSX na mesma linha'
  }
];

function findMalformedComments() {
  console.log('🔍 DETECTANDO COMENTÁRIOS PORTUGUESES MALFORMADOS...\n');
  
  let totalErrors = 0;
  let affectedFiles = 0;
  const errorsByFile = {};

  try {
    // Buscar todos os arquivos TypeScript/TSX
    const command = `find src -name "*.ts" -o -name "*.tsx" | grep -v node_modules`;
    const files = execSync(command, { encoding: 'utf8' }).trim().split('\n').filter(f => f);

    files.forEach(filePath => {
      if (!fs.existsSync(filePath)) return;
      
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let fileErrors = 0;

      lines.forEach((line, index) => {
        CRITICAL_PATTERNS.forEach(pattern => {
          const matches = line.match(pattern.regex);
          if (matches) {
            if (!errorsByFile[filePath]) {
              errorsByFile[filePath] = [];
              affectedFiles++;
            }
            
            errorsByFile[filePath].push({
              line: index + 1,
              content: line.trim(),
              pattern: pattern.name,
              description: pattern.description
            });
            
            fileErrors++;
            totalErrors++;
          }
        });
      });
    });

    // Relatório dos resultados
    if (totalErrors === 0) {
      console.log('✅ NENHUM COMENTÁRIO MALFORMADO ENCONTRADO!');
      console.log('✅ Build TypeScript está seguro para comentários portugueses.');
      return true;
    }

    console.log('🚨 COMENTÁRIOS MALFORMADOS ENCONTRADOS:');
    console.log(`📊 Total de erros: ${totalErrors}`);
    console.log(`📁 Arquivos afetados: ${affectedFiles}\n`);

    // Detalhes por arquivo
    Object.entries(errorsByFile).forEach(([filePath, errors]) => {
      console.log(`🔴 ${filePath} (${errors.length} erros):`);
      errors.forEach(error => {
        console.log(`   Linha ${error.line}: ${error.content}`);
        console.log(`   Tipo: ${error.pattern}`);
        console.log('');
      });
    });

    console.log('🛠️ COMO CORRIGIR:');
    console.log('1. Separar comentários do código em linhas diferentes');
    console.log('2. Exemplo:');
    console.log('   ❌ // Nova interface, title?: string');
    console.log('   ✅ // Nova interface');
    console.log('      title?: string\n');
    
    console.log('3. Executar script de correção automática:');
    console.log('   node scripts/fix-malformed-comments.js\n');

    return false;

  } catch (error) {
    console.error('❌ Erro ao executar detecção:', error.message);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const isClean = findMalformedComments();
  process.exit(isClean ? 0 : 1);
}

module.exports = { findMalformedComments };