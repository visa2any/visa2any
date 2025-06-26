const fs = require('fs');
const path = require('path');

function comprehensiveFix(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  
  // 1. Fix corrupted import statements
  fixed = fixed.replace(/from 'e'xport/g, "from 'next/server'\n\nexport");
  fixed = fixed.replace(/import \{ NextRequest, NextResponse \} from 'next\/server',import/g, "import { NextRequest, NextResponse } from 'next/server'\nimport");
  
  // 2. Fix missing semicolons after imports
  fixed = fixed.replace(/import { ([^}]*) } from ['"]([^'"]*)['"]/g, "import { $1 } from '$2'");
  
  // 3. Fix broken function declarations
  fixed = fixed.replace(/export async function (GET|POST|PUT|DELETE)\(/g, '\nexport async function $1(');
  
  // 4. Fix missing variable assignments
  fixed = fixed.replace(/const body =\s*\n/g, 'const body = await request.json()\n');
  fixed = fixed.replace(/const clientId =\s*\n/g, 'const clientId = params.id\n');
  fixed = fixed.replace(/let webScrapingActive =\s*\n/g, 'let webScrapingActive = false\n');
  fixed = fixed.replace(/let emailMonitoringActive =\s*\n/g, 'let emailMonitoringActive = false\n');
  
  // 5. Fix commas that should be semicolons
  fixed = fixed.replace(/^(\s*)(let|const|var) ([^=]+=[^,\n]+),(\s*)(let|const|var)/gm, '$1$2 $3\n$4$5');
  
  // 6. Fix broken object/array syntax
  fixed = fixed.replace(/,(\s*)\)/g, '$1)');
  fixed = fixed.replace(/,(\s*)\]/g, '$1]');
  fixed = fixed.replace(/,(\s*)\}/g, '$1}');
  
  // 7. Fix broken await expressions
  fixed = fixed.replace(/await ([^(]+)\(\n/g, 'await $1(');
  
  // 8. Fix missing commas in actual objects/arrays
  fixed = fixed.replace(/}\s*\n\s*{/g, '},\n    {');
  fixed = fixed.replace(/]\s*\n\s*\[/g, '],\n    [');
  
  // 9. Fix function calls that got broken
  fixed = fixed.replace(/\)\s*,\s*\n\s*async function/g, ')\n\nasync function');
  
  // 10. Fix token variable reference
  fixed = fixed.replace(/const token = tokenVar/g, 'const token = process.env.TELEGRAM_BOT_TOKEN');
  
  return fixed;
}

// Get all API route files
function getAllApiFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllApiFiles(fullPath));
    } else if (item === 'route.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

console.log('🔧 Iniciando correção abrangente...');

const apiDir = './src/app/api';
const apiFiles = getAllApiFiles(apiDir);

let filesFixed = 0;

apiFiles.forEach(file => {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const fixed = comprehensiveFix(file);
    
    if (original !== fixed) {
      fs.writeFileSync(file, fixed);
      filesFixed++;
      console.log(`✅ Corrigido: ${file}`);
    } else {
      console.log(`⏭️  Já correto: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Erro ao processar ${file}:`, error.message);
  }
});

console.log(`\n🎉 Correção abrangente concluída! ${filesFixed} arquivos corrigidos.`);