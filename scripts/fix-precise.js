#!/usr/bin/env node

/**
 * 🛠️ CORREÇÃO PRECISA - 100% SAFE
 * 
 * Corrige apenas os padrões específicos encontrados
 * Sem riscos de alterar código válido
 */

const fs = require('fs');
const path = require('path');
const { findPreciseErrors, PRECISE_PATTERNS } = require('./validate-precise');

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, symbol, message) {
  console.log(`${colors[color]}${symbol} ${message}${colors.reset}`);
}

function fixPreciseErrors(dryRun = false) {
  console.log(dryRun ? 
    `${colors.bold}${colors.blue}🔍 SIMULAÇÃO DE CORREÇÃO PRECISA${colors.reset}\n` : 
    `${colors.bold}${colors.blue}🛠️ CORREÇÃO PRECISA EM EXECUÇÃO${colors.reset}\n`
  );
  
  // Primeiro detectar todos os erros
  const detection = findPreciseErrors();
  
  if (detection.success) {
    log('green', '✅', 'Nenhum erro para corrigir!');
    return { success: true, fixedFiles: 0, totalFixes: 0 };
  }

  let totalFixes = 0;
  let fixedFiles = 0;
  const fixResults = {};

  // Corrigir arquivo por arquivo
  Object.entries(detection.errors).forEach(([filePath, errors]) => {
    const result = fixFileErrors(filePath, errors, dryRun);
    if (result.fixes > 0) {
      totalFixes += result.fixes;
      fixedFiles++;
      fixResults[filePath] = result;
      
      if (dryRun) {
        log('blue', '🔍', `${filePath}: ${result.fixes} correções seriam aplicadas`);
      } else {
        log('green', '✅', `${filePath}: ${result.fixes} correções aplicadas`);
      }
    }
  });

  // Relatório final
  console.log(`\n${colors.bold}📊 RELATÓRIO DE CORREÇÃO:${colors.reset}`);
  console.log(`🔧 Correções ${dryRun ? 'simuladas' : 'aplicadas'}: ${totalFixes}`);
  console.log(`📁 Arquivos ${dryRun ? 'que seriam afetados' : 'corrigidos'}: ${fixedFiles}`);

  if (!dryRun && totalFixes > 0) {
    console.log('\n🎉 CORREÇÃO CONCLUÍDA!');
    console.log('📋 Próximos passos:');
    console.log('1. npm run validate:precise  # Verificar se correções funcionaram');
    console.log('2. npm run build            # Testar build completo');
    console.log('3. git add -A && git commit # Commit das correções');
  } else if (dryRun && totalFixes > 0) {
    console.log('\n💡 Para aplicar as correções:');
    console.log('npm run fix:precise --apply');
  }

  return { 
    success: totalFixes > 0, 
    fixedFiles, 
    totalFixes, 
    results: fixResults 
  };
}

function fixFileErrors(filePath, errors, dryRun) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let content = originalContent;
    let fixes = 0;
    const appliedFixes = [];

    // Agrupar erros por linha para processar de forma eficiente
    const errorsByLine = {};
    errors.forEach(error => {
      if (!errorsByLine[error.line]) {
        errorsByLine[error.line] = [];
      }
      errorsByLine[error.line].push(error);
    });

    // Processar linha por linha (de trás para frente para não afetar números de linha)
    const lines = content.split('\n');
    const sortedLineNumbers = Object.keys(errorsByLine).map(Number).sort((a, b) => b - a);

    sortedLineNumbers.forEach(lineNum => {
      const lineIndex = lineNum - 1;
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const originalLine = lines[lineIndex];
        const fixedLine = fixLineErrors(originalLine, errorsByLine[lineNum]);
        
        if (fixedLine !== originalLine) {
          lines[lineIndex] = fixedLine;
          fixes++;
          appliedFixes.push({
            line: lineNum,
            original: originalLine.trim(),
            fixed: fixedLine.trim()
          });
        }
      }
    });

    const newContent = lines.join('\n');

    if (!dryRun && fixes > 0) {
      fs.writeFileSync(filePath, newContent, 'utf8');
    }

    return { 
      fixes, 
      appliedFixes,
      changed: newContent !== originalContent 
    };

  } catch (error) {
    log('red', '❌', `Erro ao processar ${filePath}: ${error.message}`);
    return { fixes: 0, appliedFixes: [], changed: false };
  }
}

function fixLineErrors(line, lineErrors) {
  let fixedLine = line;

  // Aplicar correções específicas baseadas nos padrões
  lineErrors.forEach(error => {
    switch (error.pattern) {
      case 'Comentário com vírgula e código':
        // Pattern: // comentário,código -> // comentário\nCÓDIGO
        fixedLine = fixedLine.replace(
          /\/\/([^,\n]+),\s*([a-zA-Z].*)/g,
          (match, comment, code) => {
            const indent = line.match(/^(\s*)/)[1];
            return `//${comment}\n${indent}${code}`;
          }
        );
        break;
        
      case 'Múltiplas declarações em linha':
        // Pattern: ,let var = -> \nlet var =
        fixedLine = fixedLine.replace(
          /,(\s*)(let|const|function|async|if|for|while)(\s+)/g,
          (match, spaces1, keyword, spaces2) => {
            const indent = line.match(/^(\s*)/)[1];
            return `\n${indent}${keyword}${spaces2}`;
          }
        );
        break;
        
      case 'Vírgulas seguidas de blocos':
        // Pattern: ,  // comentário -> \n// comentário
        fixedLine = fixedLine.replace(
          /,(\s*)(\/\/|try\s*\{|if\s*\(|for\s*\(|while\s*\()/g,
          (match, spaces, code) => {
            const indent = line.match(/^(\s*)/)[1];
            return `\n${indent}${code}`;
          }
        );
        break;
    }
  });

  return fixedLine;
}

// Executar se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  
  if (dryRun) {
    console.log('ℹ️ Modo simulação ativo. Use --apply para aplicar as correções.\n');
  }
  
  const result = fixPreciseErrors(dryRun);
  process.exit(result.success || result.totalFixes === 0 ? 0 : 1);
}

module.exports = { fixPreciseErrors };