#!/usr/bin/env node

const fs = require('fs');

// Specific manual fixes for remaining issues
const manualFixes = [
  {
    file: 'src/app/api/activate-monitoring/route.ts',
    find: 'const [recentAlerts, consulateAlerts] = await Promise.all([,\n          emailMonitoringService.checkRecentEmails(),\n          emailMonitoringService.checkConsulateEmails()',
    replace: 'const [recentAlerts, consulateAlerts] = await Promise.all([\n          emailMonitoringService.checkRecentEmails(),\n          emailMonitoringService.checkConsulateEmails()'
  },
  {
    file: 'src/app/api/admin/clients/route.ts',
    find: '[clients, total] = await Promise.all([,\n        prisma.client.findMany({',
    replace: '[clients, total] = await Promise.all([\n        prisma.client.findMany({'
  },
  {
    file: 'src/app/api/admin/hybrid-bookings/route.ts',
    find: 'return NextResponse.json({,\n          error: \'Ação não reconhecida\'',
    replace: 'return NextResponse.json({\n          error: \'Ação não reconhecida\''
  },
  {
    file: 'src/app/api/advisory/compliance/route.ts',
    find: 'country: z.string()\n  visaType: z.string(),',
    replace: 'country: z.string(),\n  visaType: z.string(),'
  },
  {
    file: 'src/app/api/advisory/engine/route.ts',
    find: 'visaType: z.string()\n    age: z.number().optional(),',
    replace: 'visaType: z.string(),\n    age: z.number().optional(),'
  }
];

console.log('🔧 Applying final manual syntax fixes...');

let totalFixed = 0;

manualFixes.forEach(({ file, find, replace }) => {
  try {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes(find)) {
      content = content.replace(find, replace);
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed syntax in ${file}`);
      totalFixed++;
    } else {
      console.log(`ℹ️  Pattern not found in ${file} (may already be fixed)`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Applied ${totalFixed} final syntax fixes`);