#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚨 CORREÇÃO URGENTE DE SYNTAX ERRORS');
console.log('='.repeat(50));

let totalFixed = 0;

// Arquivos específicos com erros de build
const filesWithErrors = [
  'src/app/api/activate-monitoring/route.ts',
  'src/app/api/admin/clients/route.ts', 
  'src/app/api/admin/hybrid-bookings/route.ts',
  'src/app/api/advisory/compliance/route.ts',
  'src/app/api/advisory/engine/route.ts'
];

function fixSyntaxErrors(filePath) {
  console.log(`🔧 Corrigindo: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Padrões de erro específicos dos logs
  const syntaxFixes = [
    // Vírgula extra antes de }
    { pattern: /,(\s*})/g, replacement: '$1' },
    
    // Vírgula extra antes de )
    { pattern: /,(\s*\))/g, replacement: '$1' },
    
    // Vírgula depois de return statement
    { pattern: /return\s+([^,\n]+),(\s*$)/gm, replacement: 'return $1$2' },
    
    // Vírgula no final de if/switch statements  
    { pattern: /},(\s*})/g, replacement: '}$1' },
    
    // Vírgula no final de case statements
    { pattern: /status: 400\s*\),(\s*})/g, replacement: 'status: 400 )$1' },
    
    // Vírgula no final de catch blocks
    { pattern: /status: 500\s*\),(\s*})/g, replacement: 'status: 500 )$1' },
    
    // Vírgula específica dos erros reportados
    { pattern: /{ status: 400 }\),(\s*})/g, replacement: '{ status: 400 })$1' },
    { pattern: /{ status: 500 }\),(\s*})/g, replacement: '{ status: 500 })$1' },
    
    // Vírgulas em switch cases
    { pattern: /,(\s*}(\s*catch|\s*$))/g, replacement: '$1' },
    
    // Vírgulas em objetos no final de linhas
    { pattern: /status = status,(\s*})/g, replacement: 'status = status$1' }
  ];
  
  syntaxFixes.forEach(fix => {
    const before = content;
    content = content.replace(fix.pattern, fix.replacement);
    if (before !== content) {
      modified = true;
    }
  });
  
  // Correções específicas por arquivo baseado nos erros
  if (filePath.includes('activate-monitoring')) {
    content = content.replace(
      /return NextResponse\.json\(\{ error: 'Ação inválida' \}, \{ status: 400 \}\),/g,
      "return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })"
    );
    modified = true;
  }
  
  if (filePath.includes('admin/clients')) {
    content = content.replace(
      /where\.status = status,/g,
      'where.status = status'
    );
    modified = true;
  }
  
  if (filePath.includes('hybrid-bookings')) {
    content = content.replace(
      /\}, \{ status: 500 \}\),(\s*},)/g,
      '}, { status: 500 })$1'
    );
    modified = true;
  }
  
  if (filePath.includes('advisory/compliance')) {
    content = content.replace(
      /\),(\s*}(\s*console\.error))/g,
      ')$1'
    );
    modified = true;
  }
  
  if (filePath.includes('advisory/engine')) {
    content = content.replace(
      /= await performEligibilityAssessment\([^,]+\),(\s*})/g,
      '= await performEligibilityAssessment(validatedData.profile, countryExpertise)$1'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ ${filePath} corrigido!`);
    totalFixed++;
  } else {
    console.log(`   ⚪ ${filePath} sem alterações`);
  }
}

// Corrigir todos os arquivos específicos
filesWithErrors.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    fixSyntaxErrors(fullPath);
  } else {
    console.log(`❌ Arquivo não encontrado: ${fullPath}`);
  }
});

// Também verificar outros arquivos na pasta api para vírgulas extras
function scanAndFixDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanAndFixDirectory(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      // Verificar apenas por vírgulas extras críticas
      let content = fs.readFileSync(filePath, 'utf8');
      const before = content;
      
      // Só corrigir vírgulas que definitivamente causam erro de sintaxe
      content = content.replace(/,(\s*}\s*catch)/g, '$1');
      content = content.replace(/,(\s*}\s*$)/gm, '$1');
      content = content.replace(/status: [45]\d{2}\s*\)\s*,(\s*})/g, (match) => {
        return match.replace(/,(\s*})/, '$1');
      });
      
      if (before !== content) {
        fs.writeFileSync(filePath, content);
        console.log(`   🔧 ${filePath} - vírgulas extras removidas`);
        totalFixed++;
      }
    }
  });
}

console.log('\n🔍 Verificando outros arquivos...');
scanAndFixDirectory('./src/app/api');

console.log('\n' + '='.repeat(50));
console.log(`✅ CORREÇÃO CONCLUÍDA! ${totalFixed} arquivo(s) corrigido(s)`);

if (totalFixed > 0) {
  console.log('\n🎉 Syntax errors corrigidos!');
  console.log('🚀 Pronto para novo deploy');
} else {
  console.log('\n✅ Nenhuma correção necessária');
}