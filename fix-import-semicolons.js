const fs = require('fs');
const path = require('path');

// Função para corrigir imports e outras declarações
function fixSemicolonIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  
  // 1. Corrigir imports que foram corrompidos (vírgula em vez de ponto e vírgula)
  fixed = fixed.replace(
    /import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"],\s*import/g,
    (match) => match.replace(',import', '\nimport')
  );
  
  // 2. Corrigir imports múltiplos na mesma linha
  fixed = fixed.replace(
    /import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"],import/g,
    (match) => match.replace(',import', '\nimport')
  );
  
  // 3. Corrigir declarações let/const/var separadas por vírgula quando deveriam ser linhas separadas
  fixed = fixed.replace(
    /(let|const|var)\s+(\w+)\s*=\s*[^,\n]+,\s*(let|const|var)\s+/g,
    '$1 $2 = $1 $2 = '.replace(/= \$1 \$2 =/, '= ').replace(/,$/, '') + '\n$3 '
  );
  
  // 4. Padrão mais específico para imports corrompidos
  fixed = fixed.replace(
    /(['"])([^'"]*)\1,\s*import/g,
    '$1$2$1\nimport'
  );
  
  // 5. Corrigir comentários seguidos de vírgula
  fixed = fixed.replace(
    /(\/\/[^\n]*),(\s*[a-zA-Z_$])/g,
    '$1\n$2'
  );
  
  // 6. Corrigir export/import statements malformados
  fixed = fixed.replace(
    /}\s+from\s+['"][^'"]+['"],\s*(\w)/g,
    "} from '$1'"
  );
  
  return fixed;
}

// Função recursiva para encontrar todos os arquivos TypeScript/JavaScript
function findAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      // Pular diretórios que não precisamos
      if (['.git', 'node_modules', '.next', 'dist', 'build'].includes(item)) {
        continue;
      }
      
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findAllFiles(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Erro ao ler diretório ${dir}:`, error.message);
  }
  
  return files;
}

// Executar correções
console.log('🔍 Vasculhando TODOS os arquivos TypeScript/JavaScript...');

const allFiles = findAllFiles('./');
console.log(`📁 Encontrados ${allFiles.length} arquivos para verificar`);

let totalFixed = 0;
let filesWithIssues = [];

allFiles.forEach(file => {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const fixed = fixSemicolonIssues(file);
    
    if (original !== fixed) {
      fs.writeFileSync(file, fixed);
      totalFixed++;
      filesWithIssues.push(file);
      console.log(`✅ Corrigido: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Erro ao processar ${file}:`, error.message);
  }
});

console.log(`\n🎉 Correção concluída!`);
console.log(`📊 Estatísticas:`);
console.log(`   - Arquivos verificados: ${allFiles.length}`);
console.log(`   - Arquivos corrigidos: ${totalFixed}`);

if (filesWithIssues.length > 0) {
  console.log(`\n📋 Arquivos que foram corrigidos:`);
  filesWithIssues.forEach(file => console.log(`   - ${file}`));
} else {
  console.log(`\n✨ Nenhum arquivo precisou de correção!`);
}