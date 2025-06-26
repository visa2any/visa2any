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
    const line = lines[i];
    const lineNum = i + 1;
    
    // Check for missing commas in NextResponse.json calls
    if (line.includes('NextResponse.json(')) {
      // Look for patterns like: } followed by { without comma
      const nextLines = lines.slice(i, i + 10).join('\n');
      
      // Pattern 1: success: true followed by other property without comma
      if (nextLines.match(/success:\s*true\s+[a-zA-Z_]/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_after_success',
          content: line.trim()
        });
      }
      
      // Pattern 2: } followed by { without comma (NextResponse parameters)
      if (nextLines.match(/}\s*\{\s*status:/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_in_nextresponse',
          content: line.trim()
        });
      }
    }
    
    // Check for object literals missing commas
    if (line.match(/[a-zA-Z0-9_"']\s*[a-zA-Z0-9_"'].*:/)) {
      // This is a property line
 check if previous line ended without comma
      if (i > 0) {
        const prevLine = lines[i - 1].trim();
        if (prevLine && 
            !prevLine.endsWith(',') && 
            !prevLine.endsWith('{') && 
            !prevLine.endsWith('[') &&
            !prevLine.includes('//') &&
            prevLine.match(/[a-zA-Z0-9_"']$/)) {
          errors.push({
            line: i, // Previous line number
            type: 'missing_comma_between_properties',
            content: prevLine
          });
        }
      }
    }
    
    // Check for destructuring assignment missing commas
    if (line.includes('const {') || line.includes('let {')) {
      const destructureLines = lines.slice(i, i + 10).join('\n');
      if (destructureLines.match(/[a-zA-Z0-9_]+\s+[a-zA-Z0-9_]+/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_in_destructuring',
          content: line.trim()
        });
      }
    }
    
    // Check for function parameter lists missing commas
    if (line.match(/function\s+\w+\s*\(/)) {
      const funcLines = lines.slice(i, i + 5).join('\n');
      if (funcLines.match(/\(\s*[a-zA-Z0-9_:]+\s+[a-zA-Z0-9_:]+/)) {
        errors.push({
          line: lineNum,
          type: 'missing_comma_in_function_params',
          content: line.trim()
        });
      }
    }
  }
  
  return errors;
}

// Main execution
const apiDir = path.join(__dirname, 'src', 'app', 'api');
const files = findTypescriptFiles(apiDir);

console.log(`🔍 Scanning ${files.length} TypeScript files for comma syntax errors...\n`);

const allErrors = [];

for (const file of files) {
  const errors = checkFile(file);
  if (errors.length > 0) {
    allErrors.push({ file, errors });
  }
}

if (allErrors.length === 0) {
  console.log('✅ No comma syntax errors found!');
} else {
  console.log(`❌ Found comma syntax errors in ${allErrors.length} files:\n`);
  
  for (const { file, errors } of allErrors) {
    console.log(`📄 ${file.replace(__dirname + '/', '')}`);
    
    for (const error of errors) {
      console.log(`   Line ${error.line}: ${error.type}`);
      console.log(`   Code: ${error.content}`);
      console.log('');
    }
    console.log('---\n');
  }
  
  console.log(`📊 Summary: ${allErrors.reduce((sum, f) => sum + f.errors.length, 0)} total errors across ${allErrors.length} files`);
}