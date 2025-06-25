#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files with specific errors from build log
const errorFiles = [
  'src/app/api/activate-monitoring/route.ts',
  'src/app/api/admin/clients/route.ts', 
  'src/app/api/admin/hybrid-bookings/route.ts',
  'src/app/api/advisory/compliance/route.ts',
  'src/app/api/advisory/engine/route.ts'
];

console.log(`🔍 Fixing missing commas in ${errorFiles.length} specific files`);

let totalFixed = 0;

errorFiles.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileFixed = 0;

    // Fix pattern 1: Missing comma between object properties
    // error: 'message'\n      details: 'value' -> error: 'message',\n      details: 'value'
    const pattern1 = /(\w+:\s*[^,\n}]+)\n(\s+\w+:)/g;
    let matches = [...newContent.matchAll(pattern1)];
    if (matches.length > 0) {
      newContent = newContent.replace(pattern1, '$1,\n$2');
      fileFixed += matches.length;
      console.log(`  ${filePath}: Fixed ${matches.length} missing commas between object properties`);
    }

    // Fix pattern 2: Missing comma between array elements  
    // { name: { contains: search } }\n        { email: { contains: search } }
    const pattern2 = /(\}\s*)\n(\s+\{)/g;
    matches = [...newContent.matchAll(pattern2)];
    if (matches.length > 0) {
      newContent = newContent.replace(pattern2, '$1,\n$2');
      fileFixed += matches.length;
      console.log(`  ${filePath}: Fixed ${matches.length} missing commas between array elements`);
    }

    // Fix pattern 3: Missing comma in object shorthand
    // bookings\n      stats -> bookings,\n      stats
    const pattern3 = /(\w+)\n(\s+\w+)(?=\s*\})/g;
    matches = [...newContent.matchAll(pattern3)];
    if (matches.length > 0) {
      newContent = newContent.replace(pattern3, '$1,\n$2');
      fileFixed += matches.length;
      console.log(`  ${filePath}: Fixed ${matches.length} missing commas in object shorthand`);
    }

    if (fileFixed > 0) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed ${fileFixed} issues in ${filePath}`);
      totalFixed += fileFixed;
    } else {
      console.log(`✓ No issues found in ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} missing comma issues across ${errorFiles.length} files`);