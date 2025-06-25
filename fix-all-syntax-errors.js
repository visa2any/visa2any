const fs = require('fs');
const path = require('path');

function fixSyntaxErrors(content) {
  let fixed = content;
  
  // Fix 1: Missing comma after object properties before closing brace and new property
  fixed = fixed.replace(/^(\s+)([a-zA-Z_][a-zA-Z0-9_]*:.*)\n(\s+)([a-zA-Z_][a-zA-Z0-9_]*:)/gm, '$1$2,\n$3$4');
  
  // Fix 2: Missing comma after closing brace of object property
  fixed = fixed.replace(/^(\s+})(\s*)(\n\s+[a-zA-Z_][a-zA-Z0-9_]*:)/gm, '$1,$2$3');
  
  // Fix 3: Missing comma between NextResponse parameters
  fixed = fixed.replace(/(\{ error: [^}]+\})\s*(\n\s*\{ status: \d+\})/g, '$1,$2');
  
  // Fix 4: Missing comma after property before 'read:' or other properties
  fixed = fixed.replace(/^(\s+[a-zA-Z_][a-zA-Z0-9_]*:.*)\n(\s+read:)/gm, '$1,\n$2');
  fixed = fixed.replace(/^(\s+[a-zA-Z_][a-zA-Z0-9_]*:.*)\n(\s+data:)/gm, '$1,\n$2');
  fixed = fixed.replace(/^(\s+[a-zA-Z_][a-zA-Z0-9_]*:.*)\n(\s+active:)/gm, '$1,\n$2');
  fixed = fixed.replace(/^(\s+[a-zA-Z_][a-zA-Z0-9_]*:.*)\n(\s+affiliateId)/gm, '$1,\n$2');
  fixed = fixed.replace(/^(\s+[a-zA-Z_][a-zA-Z0-9_]*:.*)\n(\s+priority:)/gm, '$1,\n$2');
  fixed = fixed.replace(/^(\s+[a-zA-Z_][a-zA-Z0-9_]*:.*)\n(\s+createdAt:)/gm, '$1,\n$2');
  
  // Fix 5: Missing comma after Prisma where clause before data
  fixed = fixed.replace(/(where:\s*\{[^}]+\})\s*(\n\s+data:)/g, '$1,$2');
  
  // Fix 6: Missing comma in array between objects
  fixed = fixed.replace(/^(\s+}\s*)(\n\s+\{)/gm, '$1,\n$2');
  
  // Fix 7: Missing comma after spread operator
  fixed = fixed.replace(/(\.\.\.endpoint)\s*(\n\s+secret:)/g, '$1,$2');
  
  // Fix 8: Missing comma in destructuring assignments
  fixed = fixed.replace(/(= \{\})\s*(\n\s+[a-zA-Z_][a-zA-Z0-9_]* =)/g, '$1,$2');
  
  return fixed;
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      console.log(`Processing: ${fullPath}`);
      
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fixedContent = fixSyntaxErrors(content);
        
        if (content !== fixedContent) {
          fs.writeFileSync(fullPath, fixedContent);
          console.log(`✅ Fixed syntax errors in: ${fullPath}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${fullPath}:`, error.message);
      }
    }
  }
}

console.log('🔧 Starting comprehensive syntax error fix...');
processDirectory('src/app/api');
console.log('✅ Comprehensive syntax error fix completed!');