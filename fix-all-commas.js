const fs = require('fs');
const path = require('path');

// Função para corrigir vírgulas em um arquivo
function fixCommas(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  
  // Padrões de correção mais abrangentes
  const patterns = [
    // Objetos: propriedade sem vírgula seguida de outra propriedade
    /(\w+:\s*[^,\n}]+)\n(\s+)(\w+:)/g,
    
    // Arrays: elemento sem vírgula seguido de outro elemento
    /([^,\n\]]+)\n(\s*)([\{\[\'\"\w])/g,
    
    // Parâmetros de função: parâmetro sem vírgula seguido de outro
    /(\w+[^,\n\)]+)\n(\s+)(\w+[^,\n\)]*\))/g,
    
    // Propriedades true/false/string sem vírgula
    /(:\s*(?:true|false|'[^']*'|"[^"]*"|[\w\.]+))\n(\s+)(\w+:)/g,
  ];
  
  patterns.forEach(pattern => {
    fixed = fixed.replace(pattern, '$1,$2$3');
  });
  
  return fixed;
}

// Buscar todos os arquivos TypeScript na pasta src/app/api
function findApiFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findApiFiles(fullPath));
    } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Executar correções
const apiDir = './src/app/api';
const files = findApiFiles(apiDir);

console.log(`Corrigindo ${files.length} arquivos...`);

let totalFixed = 0;
files.forEach(file => {
  const original = fs.readFileSync(file, 'utf8');
  const fixed = fixCommas(file);
  
  if (original !== fixed) {
    fs.writeFileSync(file, fixed);
    totalFixed++;
    console.log(`✅ Corrigido: ${file}`);
  }
});

console.log(`\n🎉 Correção concluída! ${totalFixed} arquivos foram corrigidos.`);