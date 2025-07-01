#!/usr/bin/env node

/**
 * 🛠️ CORRETOR AUTOMÁTICO DE COMENTÁRIOS PORTUGUESES MALFORMADOS
 * 
 * Este script corrige automaticamente o padrão crítico:
 * // comment, code  →  // comment\ncode
 * 
 * Baseado nas correções aplicadas em 2025-06-27
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getIndentation(line) {
  const match = line.match(/^(\s*)/);
  return match ? match[1] : '';
}

function fixMalformedComments(filePath, dryRun = false) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Arquivo não encontrado: ${filePath}`);
    return { fixed: 0, errors: [] };
  }

  const originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;
  let fixCount = 0;
  const fixes = [];

  // Padrão principal: // comment, code
  const mainPattern = /(^(\s*)\/\/[^,\n]+),(\s+)([a-zA-Z<].*)/gm;
  
  content = content.replace(mainPattern, (match, fullMatch, indentation, spaces, code) => {
    const comment = fullMatch.replace(/,\s*$/, ''); // Remove vírgula do final
    const fix = `${comment}\n${indentation}${code}`;
    
    fixes.push({
      original: match.trim(),
      fixed: fix.trim(),
      pattern: 'comment-code-same-line'
    });
    
    fixCount++;
    return fix;
  });

  // Padrão específico para JSX: // comment, <element>
  const jsxPattern = /(^(\s*)\/\/[^,\n]+),(\s+)(<.*)/gm;
  
  content = content.replace(jsxPattern, (match, fullMatch, indentation, spaces, jsx) => {
    const comment = fullMatch.replace(/,\s*$/, '');
    const fix = `${comment}\n${indentation}${jsx}`;
    
    fixes.push({
      original: match.trim(),
      fixed: fix.trim(),
      pattern: 'comment-jsx-same-line'
    });
    
    fixCount++;
    return fix;
  });

  // Padrão para funções: // comment, function_name: (params) => {
  const functionPattern = /(^(\s*)\/\/[^,\n]+),(\s+)(\w+:\s*\([^)]*\)\s*=>\s*{)/gm;
  
  content = content.replace(functionPattern, (match, fullMatch, indentation, spaces, func) => {
    const comment = fullMatch.replace(/,\s*$/, '');
    const fix = `${comment}\n${indentation}${func}`;
    
    fixes.push({
      original: match.trim(),
      fixed: fix.trim(),
      pattern: 'comment-function-same-line'
    });
    
    fixCount++;
    return fix;
  });

  if (dryRun) {
    return { 
      fixed: fixCount, 
      errors: [], 
      fixes: fixes,
      wouldChange: content !== originalContent 
    };
  }

  if (content !== originalContent) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}: ${fixCount} comentários corrigidos`);
    } catch (error) {
      return { 
        fixed: 0, 
        errors: [`Erro ao escrever arquivo: ${error.message}`] 
      };
    }
  } else {
    console.log(`✨ ${filePath}: Nenhum comentário malformado encontrado`);
  }

  return { fixed: fixCount, errors: [], fixes: fixes };
}

function fixAllMalformedComments(dryRun = false) {
  console.log(dryRun ? 
    '🔍 SIMULANDO CORREÇÃO DE COMENTÁRIOS MALFORMADOS...\n' : 
    '🛠️ CORRIGINDO COMENTÁRIOS MALFORMADOS...\n'
  );
  
  let totalFixed = 0;
  let affectedFiles = 0;
  const allErrors = [];

  try {
    // Buscar todos os arquivos TypeScript/TSX
    const command = `find src -name "*.ts" -o -name "*.tsx" | grep -v node_modules`;
    const files = execSync(command, { encoding: 'utf8' }).trim().split('\n').filter(f => f);

    console.log(`📁 Processando ${files.length} arquivos...\n`);

    files.forEach(filePath => {
      const result = fixMalformedComments(filePath, dryRun);
      
      if (result.fixed > 0) {
        totalFixed += result.fixed;
        affectedFiles++;
        
        if (dryRun && result.fixes.length > 0) {
          console.log(`🔍 ${filePath} (${result.fixed} correções seriam aplicadas):`);
          result.fixes.forEach(fix => {
            console.log(`   ❌ ${fix.original}`);
            console.log(`   ✅ ${fix.fixed.replace('\n', '\\n')}`);
            console.log('');
          });
        }
      }
      
      if (result.errors.length > 0) {
        allErrors.push(...result.errors);
      }
    });

    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL:');
    console.log(`✅ Comentários ${dryRun ? 'que seriam corrigidos' : 'corrigidos'}: ${totalFixed}`);
    console.log(`📁 Arquivos ${dryRun ? 'que seriam afetados' : 'afetados'}: ${affectedFiles}`);
    
    if (allErrors.length > 0) {
      console.log(`❌ Erros encontrados: ${allErrors.length}`);
      allErrors.forEach(error => console.log(`   ${error}`));
    }

    if (!dryRun && totalFixed > 0) {
      console.log('\n🎉 CORREÇÃO CONCLUÍDA!');
      console.log('📋 Próximos passos:');
      console.log('1. npm run type-check  # Verificar se não há erros TypeScript');
      console.log('2. npm run build       # Verificar se build funciona');
      console.log('3. git add -A && git commit -m "fix: resolve malformed Portuguese comments"');
    } else if (dryRun && totalFixed > 0) {
      console.log('\n💡 Para aplicar as correções, execute:');
      console.log('node scripts/fix-malformed-comments.js --apply');
    } else if (totalFixed === 0) {
      console.log('\n✨ Nenhum comentário malformado encontrado!');
      console.log('✅ Código está limpo para comentários portugueses.');
    }

    return totalFixed > 0;

  } catch (error) {
    console.error('❌ Erro ao executar correção:', error.message);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  
  if (dryRun) {
    console.log('ℹ️ Modo simulação ativo. Use --apply para aplicar as correções.\n');
  }
  
  const hasChanges = fixAllMalformedComments(dryRun);
  process.exit(hasChanges && dryRun ? 1 : 0);
}

module.exports = { fixMalformedComments, fixAllMalformedComments };