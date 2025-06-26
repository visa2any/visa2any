#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript files in src/app/api
const files = execSync('find src/app/api -name "*.ts" -type f', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file.length > 0);

console.log(`🔍 Found ${files.length} TypeScript files to check`);

let totalFixed = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileFixed = 0;

    // Fix pattern 1: return NextResponse.json(...), -> return NextResponse.json(...)
    const pattern1 = /(\}, \{ status: \d+ \}),(?=\s*$)/gm;
    const matches1 = newContent.match(pattern1);
    if (matches1) {
      newContent = newContent.replace(pattern1, '$1');
      fileFixed += matches1.length;
      console.log(`  Fixed ${matches1.length} trailing commas in return statements`);
    }

    // Fix pattern 2: array/object trailing commas at end of statements
    const pattern2 = /(\],|\}),(?=\s*$)/gm;
    const matches2 = newContent.match(pattern2);
    if (matches2) {
      newContent = newContent.replace(pattern2, (match, group1) => group1);
      fileFixed += matches2.length;
      console.log(`  Fixed ${matches2.length} trailing commas in arrays/objects`);
    }

    // Fix pattern 3: function call trailing commas
    const pattern3 = /(\)\s*),(?=\s*$)/gm;
    const matches3 = newContent.match(pattern3);
    if (matches3) {
      newContent = newContent.replace(pattern3, '$1');
      fileFixed += matches3.length;
      console.log(`  Fixed ${matches3.length} trailing commas in function calls`);
    }

    // Fix pattern 4: await functionCall()

    const pattern4 = /await\s+([^(),]+\([^)]*\)),(?=\s*$)/gm;
    const matches4 = newContent.match(pattern4);
    if (matches4) {
      newContent = newContent.replace(pattern4, 'await $1');
      fileFixed += matches4.length;
      console.log(`  Fixed ${matches4.length} trailing commas in await calls`);
    }

    // Fix pattern 5: return statements with trailing comma
    const pattern5 = /return\s+([^,;]+),(?=\s*$)/gm;
    const matches5 = newContent.match(pattern5);
    if (matches5) {
      newContent = newContent.replace(pattern5, 'return $1');
      fileFixed += matches5.length;
      console.log(`  Fixed ${matches5.length} trailing commas in return values`);
    }

    if (fileFixed > 0) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed ${fileFixed} issues in ${filePath}`);
      totalFixed += fileFixed;
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} trailing comma issues across ${files.length} files`);