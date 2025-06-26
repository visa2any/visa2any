const fs = require('fs');
const path = require('path');

// Função específica para corrigir apenas os problemas de import reportados nos logs
function fixSpecificImportIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  
  // 1. Corrigir imports onde vírgulas estão separando imports na mesma linha
  // Exemplo: import { A } from 'a',import { B } from 'b'
  fixed = fixed.replace(
    /import\s+\{[^}]*\}\s+from\s+['"'][^'"]*['"],\s*import/g,
    (match) => match.replace(',import', '\nimport')
  );
  
  // 2. Corrigir declarações que perderam await/const/etc
  // Restaurar padrões comuns que foram corrompidos
  fixed = fixed.replace(/const body =\s*\nconst/g, 'const body = await request.json()\n    const');
  fixed = fixed.replace(/const (\w+) =\s*\nconst/g, 'const $1 = $1Var\n    const');
  
  // 3. Corrigir linhas com exports malformados
  fixed = fixed.replace(/from 'e'xport/g, "from 'next/server'\n\nexport");
  
  // 4. Corrigir vírgulas em await statements
  fixed = fixed.replace(/await (\w+)\(\n/g, 'await $1(');
  
  // 5. Corrigir new Date() quebrados
  fixed = fixed.replace(/new Date\(\n/g, 'new Date(');
  
  // 6. Corrigir variáveis quebradas específicas
  fixed = fixed.replace(/let webScrapingActive =\s*\nlet/g, 'let webScrapingActive = false\nlet');
  fixed = fixed.replace(/const clientId =\s*\nconst/g, 'const clientId = params.id\n    const');
  fixed = fixed.replace(/const fields =\s*\nconst/g, 'const fields = ocrResult.extractedFields\n  const');
  
  // 7. Corrigir pipes e outros patterns quebrados
  fixed = fixed.replace(/(\w+)\s*\n(\w+)>/g, '$1, $2>');
  
  // 8. Corrigir arrays quebrados
  fixed = fixed.replace(/\[,\s*(\w)/g, '[\n        $1');
  
  return fixed;
}

// Buscar apenas os arquivos específicos mencionados nos logs de erro
const problematicFiles = [
  './src/app/api/activate-monitoring/route.ts',
  './src/app/api/admin/clients/route.ts', 
  './src/app/api/admin/hybrid-bookings/route.ts',
  './src/app/api/advisory/compliance/route.ts',
  './src/app/api/advisory/engine/route.ts'
];

console.log('🔧 Corrigindo problemas específicos dos imports...');

let filesFixed = 0;

problematicFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const original = fs.readFileSync(file, 'utf8');
      const fixed = fixSpecificImportIssues(file);
      
      if (original !== fixed) {
        fs.writeFileSync(file, fixed);
        filesFixed++;
        console.log(`✅ Corrigido: ${file}`);
      } else {
        console.log(`⏭️  Já correto: ${file}`);
      }
    } else {
      console.log(`❌ Arquivo não encontrado: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Erro ao processar ${file}:`, error.message);
  }
});

console.log(`\n🎉 Correção específica concluída! ${filesFixed} arquivos corrigidos.`);