#!/usr/bin/env node

/**
 * 🚀 VALIDAÇÃO RÁPIDA ENTERPRISE
 * 
 * Sistema de validação usado pelos grandes players:
 * - Rápido (< 30 segundos)
 * - Seguro (sem modificações)
 * - Preciso (detecta problemas críticos)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function runCommand(command, description) {
  try {
    const result = execSync(command, { encoding: 'utf8', timeout: 30000 });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

async function validateQuick() {
  console.log(`${colors.bold}${colors.blue}🚀 VALIDAÇÃO RÁPIDA ENTERPRISE${colors.reset}\n`);
  
  let totalErrors = 0;
  let criticalErrors = 0;
  
  // 1. COMENTÁRIOS MALFORMADOS (CRÍTICO)
  log('blue', '🔍', 'Verificando comentários portugueses malformados...');
  const commentsCheck = runCommand('rg "//.*,\\s+\\w" src/ -n || true', 'Comentários malformados');
  
  if (commentsCheck.output && commentsCheck.output.trim()) {
    const lines = commentsCheck.output.trim().split('\n');
    criticalErrors += lines.length;
    log('red', '❌', `${lines.length} comentários malformados encontrados (CRÍTICO)`);
    log('yellow', '💡', 'Solução: node scripts/fix-malformed-comments.js --apply');
  } else {
    log('green', '✅', 'Comentários OK');
  }
  
  // 2. AUTOMATIONLOG SEM CAMPOS (CRÍTICO)
  log('blue', '🔍', 'Verificando AutomationLog sem campos obrigatórios...');
  const automationCheck = runCommand('rg "automationLog\\.create.*\\{[^}]*\\}" src/ -n | grep -v "success:" | grep -v "details:" || true', 'AutomationLog');
  
  if (automationCheck.output && automationCheck.output.trim()) {
    const lines = automationCheck.output.trim().split('\n');
    criticalErrors += lines.length;
    log('red', '❌', `${lines.length} AutomationLog sem campos obrigatórios (CRÍTICO)`);
    log('yellow', '💡', 'Solução: node scripts/fix-automation-logs.js');
  } else {
    log('green', '✅', 'AutomationLog OK');
  }
  
  // 3. TYPESCRIPT SYNTAX (CRÍTICO)
  log('blue', '🔍', 'Verificando erros TypeScript...');
  const tsCheck = runCommand('npx tsc --noEmit --skipLibCheck', 'TypeScript');
  
  if (!tsCheck.success) {
    criticalErrors++;
    log('red', '❌', 'Erros TypeScript encontrados (CRÍTICO)');
    log('yellow', '💡', 'Verifique a saída do comando TypeScript');
  } else {
    log('green', '✅', 'TypeScript OK');
  }
  
  // 4. CASTING 'as any' (ALTA PRIORIDADE)
  log('blue', '🔍', 'Verificando casting perigoso...');
  const castingCheck = runCommand('rg "as any" src/ -n || true', 'Casting');
  
  if (castingCheck.output && castingCheck.output.trim()) {
    const lines = castingCheck.output.trim().split('\n');
    totalErrors += lines.length;
    log('yellow', '⚠️', `${lines.length} casting 'as any' encontrados (ALTA PRIORIDADE)`);
    log('yellow', '💡', 'Substitua por tipos específicos');
  } else {
    log('green', '✅', 'Casting OK');
  }
  
  // 5. IMPORTS RELATIVOS (MÉDIA PRIORIDADE)
  log('blue', '🔍', 'Verificando imports relativos...');
  const importsCheck = runCommand('rg "from.*\\.\\./\\.\\./\\.\\." src/ -n || true', 'Imports');
  
  if (importsCheck.output && importsCheck.output.trim()) {
    const lines = importsCheck.output.trim().split('\n');
    totalErrors += lines.length;
    log('yellow', '⚠️', `${lines.length} imports relativos profundos (MÉDIA PRIORIDADE)`);
    log('yellow', '💡', 'Use path aliases (@/) ao invés de relativos');
  } else {
    log('green', '✅', 'Imports OK');
  }
  
  // RELATÓRIO FINAL
  console.log(`\n${colors.bold}📊 RELATÓRIO DE VALIDAÇÃO${colors.reset}`);
  console.log(`⚠️  Erros críticos: ${criticalErrors}`);
  console.log(`💡 Melhorias recomendadas: ${totalErrors}`);
  
  if (criticalErrors > 0) {
    log('red', '🚨', 'VALIDAÇÃO FALHADA - Erros críticos encontrados');
    log('yellow', '🛠️', 'Execute as correções sugeridas antes do commit');
    process.exit(1);
  } else if (totalErrors > 0) {
    log('yellow', '⚠️', 'VALIDAÇÃO APROVADA COM RESSALVAS');
    log('blue', '💡', 'Considere corrigir as melhorias recomendadas');
    process.exit(0);
  } else {
    log('green', '🎉', 'VALIDAÇÃO APROVADA - Código limpo!');
    process.exit(0);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  validateQuick().catch(error => {
    log('red', '💥', `Erro na validação: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { validateQuick };