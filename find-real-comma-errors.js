#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function findTypescriptFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return files;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const errors = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;
    
    // Check for missing commas in NextResponse.json() calls
    if (line.includes('NextResponse.json(')) {
      const nextLines = lines.slice(i, Math.min(i + 10, lines.length));
      const block = nextLines.join('\n');
      
      // Pattern: success: true followed by property without comma
      if (block.match(/success:\s*true\s+[a-zA-Z_]/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_after_success_true',
          content: line,
          context: nextLines.slice(0, 5).map(l => l.trim()).join(' ')
        });
      }
      
      // Pattern: } followed by { without comma (NextResponse parameters)
      if (block.match(/}\s*\{\s*status:/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_in_nextresponse_params',
          content: line,
          context: nextLines.slice(0, 5).map(l => l.trim()).join(' ')
        });
      }
    }
    
    // Check for missing commas in object destructuring
    if (line.includes('const {') && !line.includes('}')) {
      const nextLines = lines.slice(i, Math.min(i + 10, lines.length));
      const destructureBlock = nextLines.join('\n');
      
      // Look for patterns like: name url, (missing comma)
      if (destructureBlock.match(/[a-zA-Z_]+\s+[a-zA-Z_]+[,\s]*}/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_in_destructuring',
          content: line,
          context: nextLines.slice(0, 5).map(l => l.trim()).join(' ')
        });
      }
    }
    
    // Check for missing commas in Prisma queries
    if (line.includes('prisma.') && (line.includes('.findMany') || line.includes('.create') || line.includes('.update'))) {
      const nextLines = lines.slice(i, Math.min(i + 15, lines.length));
      const block = nextLines.join('\n');
      
      // Look for where clause patterns without commas
      if (block.match(/where:\s*\{\s*[a-zA-Z_]+:\s*[^,}]+\s+[a-zA-Z_]+:/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_in_prisma_query',
          content: line,
          context: nextLines.slice(0, 8).map(l => l.trim()).join(' ')
        });
      }
    }
  }
  
  return errors;
}

// Manual file checks based on the specific errors we found
function checkSpecificFiles() {
  const specificErrors = [];
  
  // Check the files we know have errors
  const problematicFiles = [
    'src/app/api/blog/sources/route.ts',
    'src/app/api/blog/search/route.ts',
    'src/app/api/auth/login/route.ts'
  ];
  
  for (const filePath of problematicFiles) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      // Manual inspection of known patterns
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for specific patterns we saw
        if (line.includes('success: true') && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine && !nextLine.startsWith('}') && !nextLine.startsWith('//') && !line.includes(',')) {
            specificErrors.push({
              file: filePath,
              line: i + 1,
              type: 'missing_comma_after_success_true',
              content: line.trim(),
              nextLine: nextLine
            });
          }
        }
        
        // Check for missing commas in NextResponse.json parameters
        if (line.includes('{ error:') && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.includes('{ status:') && !line.includes(',')) {
            specificErrors.push({
              file: filePath,
              line: i + 1,
              type: 'missing_comma_nextresponse_params',
              content: line.trim(),
              nextLine: nextLine
            });
          }
        }
        
        // Check for missing commas in destructuring
        if (line.includes('const {') && line.includes('name') && line.includes('url') && !line.includes(',')) {
          specificErrors.push({
            file: filePath,
            line: i + 1,
            type: 'missing_comma_in_destructuring',
            content: line.trim()
          });
        }
      }
    }
  }
  
  return specificErrors;
}

// Main execution
console.log('🔍 Searching for actual missing comma syntax errors...\n');

const specificErrors = checkSpecificFiles();

if (specificErrors.length === 0) {
  console.log('✅ No obvious comma syntax errors found in the checked files.');
} else {
  console.log(`❌ Found ${specificErrors.length} potential comma syntax errors:\n`);
  
  for (const error of specificErrors) {
    console.log(`📄 ${error.file}:${error.line}`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Code: ${error.content}`);
    if (error.nextLine) {
      console.log(`   Next: ${error.nextLine}`);
    }
    console.log('');
  }
}

console.log('\n🔍 Now checking all API files for NextResponse.json comma errors...\n');

const apiDir = path.join(__dirname, 'src', 'app', 'api');
const files = findTypescriptFiles(apiDir);

const allErrors = [];
for (const file of files) {
  const errors = checkFile(file);
  if (errors.length > 0) {
    allErrors.push({ file, errors });
  }
}

if (allErrors.length > 0) {
  console.log(`📋 Found ${allErrors.length} files with potential comma issues:\n`);
  
  for (const { file, errors } of allErrors) {
    console.log(`📄 ${file.replace(__dirname + '/', '')}`);
    for (const error of errors) {
      console.log(`   Line ${error.line}: ${error.type}`);
      console.log(`   Context: ${error.context}`);
      console.log('');
    }
    console.log('---\n');
  }
}