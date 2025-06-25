#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript files in src/app/api
const files = execSync('find src/app/api -name "*.ts" -type f', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file.length > 0);

console.log(`🔍 Found ${files.length} TypeScript files to fix missing commas`);

let totalFixed = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileFixed = 0;

    // Fix pattern 1: Object properties missing commas (not at end of object)
    // Match: property: value\n      nextProperty (space-indented next property)
    const pattern1 = /(\w+:\s*[^,\n}]+)\n(\s+\w+:)/g;
    const matches1 = [...newContent.matchAll(pattern1)];
    if (matches1.length > 0) {
      newContent = newContent.replace(pattern1, '$1,\n$2');
      fileFixed += matches1.length;
      console.log(`  ${filePath}: Fixed ${matches1.length} missing commas between object properties`);
    }

    // Fix pattern 2: Array elements missing commas 
    const pattern2 = /(\w+:\s*[^,\n\]]+)\n(\s+\w+:)/g;
    const matches2 = [...newContent.matchAll(pattern2)];
    if (matches2.length > 0) {
      newContent = newContent.replace(pattern2, '$1,\n$2');
      fileFixed += matches2.length;
      console.log(`  ${filePath}: Fixed ${matches2.length} missing commas between array elements`);
    }

    // Fix pattern 3: Missing commas in function parameters
    const pattern3 = /(\w+:\s*[^,\n}]+)\s*\n\s*(\w+:)/g;
    const matches3 = [...newContent.matchAll(pattern3)];
    if (matches3.length > 0) {
      newContent = newContent.replace(pattern3, '$1,\n      $2');
      fileFixed += matches3.length;
      console.log(`  ${filePath}: Fixed ${matches3.length} missing commas in parameters`);
    }

    if (fileFixed > 0) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed ${fileFixed} missing commas in ${filePath}`);
      totalFixed += fileFixed;
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} missing commas across ${files.length} files`);