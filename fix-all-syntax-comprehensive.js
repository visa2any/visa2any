#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Find all TypeScript files
const files = execSync('find src/app/api -name "*.ts" -type f', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file.length > 0);

console.log(`🔍 Comprehensive syntax fix for ${files.length} files`);

let totalFixed = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileFixed = 0;

    // 1. Fix missing commas in Promise.all arrays
    newContent = newContent.replace(/(await Promise\.all\(\[[\s\S]*?)\n(\s+)(\w+)/g, (match, p1, p2, p3) => {
      if (!p1.endsWith(',')) {
        fileFixed++;
        return p1 + ',\n' + p2 + p3;
      }
      return match;
    });

    // 2. Fix missing commas after function calls in arrays
    newContent = newContent.replace(/(\w+\([^)]*\))\n(\s+)(\w+\([^)]*\))/g, '$1,\n$2$3');

    // 3. Fix missing commas between object properties in Prisma queries
    newContent = newContent.replace(/(orderBy:\s*\{[^}]*\})\n(\s+)(take:|skip:|where:|select:|include:)/g, '$1,\n$2$3');

    // 4. Fix trailing commas in objects (wrong commas)
    newContent = newContent.replace(/(\w+:\s*[^,\n}]+),(\s*})/g, '$1$2');

    // 5. Fix missing commas in z.object schemas
    newContent = newContent.replace(/(z\.\w+\([^)]*\))\n(\s+)(\w+:)/g, '$1,\n$2$3');

    // 6. Fix missing commas in object shorthand properties
    newContent = newContent.replace(/(\w+)\n(\s+)(\w+)(\s*})/g, '$1,\n$2$3$4');

    // 7. Fix select objects with trailing commas
    newContent = newContent.replace(/(select:\s*\{),(\s*\n)/g, '$1$2');

    // 8. Fix return objects with trailing commas  
    newContent = newContent.replace(/(return NextResponse\.json\(\{),(\s*\n)/g, '$1$2');

    // 9. Fix function headers with trailing commas
    newContent = newContent.replace(/(headers:\s*\{[^}]*\}),(\s*\n\s*body:)/g, '$1$2');

    // 10. Count actual changes made
    if (newContent !== content) {
      const changes = (content.match(/\n/g) || []).length - (newContent.match(/\n/g) || []).length;
      fileFixed = Math.abs(changes) + 1;
    }

    if (fileFixed > 0) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed ${fileFixed} syntax issues in ${filePath}`);
      totalFixed += fileFixed;
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Fixed ${totalFixed} syntax issues across ${files.length} files`);

// Now fix specific patterns that are still causing errors
const specificFixes = [
  {
    file: 'src/app/api/activate-monitoring/route.ts',
    fixes: [
      { 
        find: 'emailMonitoringService.checkRecentEmails()\n          emailMonitoringService.checkConsulateEmails()',
        replace: 'emailMonitoringService.checkRecentEmails(),\n          emailMonitoringService.checkConsulateEmails()'
      }
    ]
  },
  {
    file: 'src/app/api/admin/clients/route.ts', 
    fixes: [
      {
        find: 'orderBy: { createdAt: \'desc\' }\n          take:',
        replace: 'orderBy: { createdAt: \'desc\' },\n          take:'
      }
    ]
  }
];

specificFixes.forEach(({ file, fixes }) => {
  try {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    fixes.forEach(({ find, replace }) => {
      if (content.includes(find)) {
        content = content.replace(find, replace);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`🔧 Applied specific fixes to ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error applying specific fix to ${file}:`, error.message);
  }
});