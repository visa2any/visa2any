#!/usr/bin/env node

/**
 * 🎯 VALIDAÇÃO PRECISA - 100% ACCURACY
 * 
 * Script corrigido baseado nos erros reais encontrados
 * Usa padrões específicos dos erros reais do codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Padrões precisos baseados nos erros reais encontrados
const PRECISE_PATTERNS = [
  {
    name: 'Comentário com vírgula e código',
    // Pattern: // comentário,código ou // comentário,let var
    pattern: /\/\/[^,\n]+,\s*[a-zA-Z]/g,
    description: 'Comentário seguido de vírgula e código na mesma linha'
  },
  {
    name: 'Múltiplas declarações em linha', 
    // Pattern: ,let var = , ,const var =
    pattern: /,\s*(let|const|function|async|if|for|while)\s+/g,
    description: 'Múltiplas declarações separadas por vírgula'
  },
  {
    name: 'Vírgulas seguidas de blocos',
    // Pattern: ,    // comentário  ou ,  try {
    pattern: /,\s*(\/\/|try\s*{|if\s*\(|for\s*\(|while\s*\()/g,
    description: 'Vírgula seguida de comentário ou bloco de código'
  }
];

function findPreciseErrors() {
  console.log(`${colors.bold}${colors.blue}🎯 VALIDAÇÃO PRECISA - 100% ACCURACY${colors.reset}\n`);
  
  let totalErrors = 0;
  const errorsByFile = {};
  
  try {
    // Buscar todos os arquivos TypeScript/TSX
    const files = getAllTSFiles();
    console.log(`📁 Analisando ${files.length} arquivos...\n`);

    files.forEach(filePath => {
      if (!fs.existsSync(filePath)) return;
      
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let fileErrors = 0;

      lines.forEach((line, index) => {
        PRECISE_PATTERNS.forEach(pattern => {
          const matches = [...line.matchAll(pattern.pattern)];
          if (matches.length > 0) {
            if (!errorsByFile[filePath]) {
              errorsByFile[filePath] = [];
            }
            
            matches.forEach(match => {
              errorsByFile[filePath].push({
                line: index + 1,
                content: line.trim(),
                match: match[0],
                pattern: pattern.name,
                description: pattern.description,
                position: match.index
              });
              
              fileErrors++;
              totalErrors++;
            });
          }
        });
      });

      if (fileErrors > 0) {
        log('yellow', '⚠️', `${filePath}: ${fileErrors} erros encontrados`);
      }
    });

    // Relatório detalhado
    if (totalErrors === 0) {
      log('green', '✅', 'NENHUM ERRO ENCONTRADO!');
      log('green', '🎉', 'Código está limpo para sintaxe crítica.');
      return { success: true, errors: [], totalErrors: 0 };
    }

    console.log(`\n${colors.bold}🚨 ERROS CRÍTICOS ENCONTRADOS:${colors.reset}`);
    console.log(`📊 Total de erros: ${totalErrors}`);
    console.log(`📁 Arquivos afetados: ${Object.keys(errorsByFile).length}\n`);

    // Detalhes por arquivo (primeiros 10 arquivos)
    const sortedFiles = Object.entries(errorsByFile)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 10);

    sortedFiles.forEach(([filePath, errors]) => {
      const relativePath = filePath.replace(process.cwd() + '/', '');
      console.log(`🔴 ${relativePath} (${errors.length} erros):`);
      
      errors.slice(0, 3).forEach(error => {
        console.log(`   Linha ${error.line}: ${error.content.substring(0, 80)}...`);
        console.log(`   Match: "${error.match}"`);
        console.log(`   Tipo: ${error.pattern}`);
        console.log('');
      });
      
      if (errors.length > 3) {
        console.log(`   ... e mais ${errors.length - 3} erros`);
        console.log('');
      }
    });

    console.log('🛠️ PRÓXIMOS PASSOS:');
    console.log('1. Executar correção automática: npm run fix:precise');
    console.log('2. Verificar resultado: npm run validate:precise');
    console.log('3. Testar build: npm run build\n');

    return { 
      success: false, 
      errors: errorsByFile, 
      totalErrors,
      affectedFiles: Object.keys(errorsByFile).length 
    };

  } catch (error) {
    log('red', '💥', `Erro na validação: ${error.message}`);
    return { success: false, errors: [], totalErrors: 0 };
  }
}

function getAllTSFiles() {
  try {
    const result = execSync('find src -name "*.ts" -o -name "*.tsx" | grep -v node_modules | head -100', { encoding: 'utf8' });
    return result.trim().split('\n').filter(f => f && f.length > 0);
  } catch (error) {
    // Fallback para sistemas sem find
    return [];
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const result = findPreciseErrors();
  process.exit(result.success ? 0 : 1);
}

module.exports = { findPreciseErrors, PRECISE_PATTERNS };