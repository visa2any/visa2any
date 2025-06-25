const fs = require('fs');

function fixNextErrors() {
  console.log('🔧 Fixing next batch of specific syntax errors...');
  
  // Fix 1: notifications/route.ts - linha 304-305 (outra função)
  try {
    const notificationsPath = 'src/app/api/affiliates/notifications/route.ts';
    let content = fs.readFileSync(notificationsPath, 'utf8');
    
    // Corrigir headers/body na segunda função
    content = content.replace(
      /(\s+headers: \{ 'Content-Type': 'application\/json' \}\s*\n\s+body: JSON\.stringify\(notification\))/g,
      (match) => match.replace("json' }\n    body:", "json' },\n    body:")
    );
    
    fs.writeFileSync(notificationsPath, content);
    console.log('✅ Fixed notifications/route.ts - linha 304-305');
  } catch (error) {
    console.error('❌ Error fixing notifications:', error.message);
  }
  
  // Fix 2: payments/route.ts - linha 268-269
  try {
    const paymentsPath = 'src/app/api/affiliates/payments/route.ts';
    let content = fs.readFileSync(paymentsPath, 'utf8');
    
    // Corrigir where/data no updateMany
    content = content.replace(
      /(\s+where: \{ paymentId \}\s*\n\s+data: \{)/,
      (match) => match.replace('paymentId }\n        data:', 'paymentId },\n        data:')
    );
    
    fs.writeFileSync(paymentsPath, content);
    console.log('✅ Fixed payments/route.ts - linha 268-269');
  } catch (error) {
    console.error('❌ Error fixing payments:', error.message);
  }
  
  // Fix 3: track/route.ts - linha 224-225
  try {
    const trackPath = 'src/app/api/affiliates/track/route.ts';
    let content = fs.readFileSync(trackPath, 'utf8');
    
    // Corrigir where/data no updateMany de clicks
    content = content.replace(
      /(\s+converted: false\s*\n\s+}\s*\n\s+data: \{)/,
      (match) => match.replace('false\n      }\n      data:', 'false\n      },\n      data:')
    );
    
    fs.writeFileSync(trackPath, content);
    console.log('✅ Fixed track/route.ts - linha 224-225');
  } catch (error) {
    console.error('❌ Error fixing track:', error.message);
  }
  
  // Fix 4: webhooks/route.ts - linha 225-227 (timestamp duplicado)
  try {
    const webhooksPath = 'src/app/api/affiliates/webhooks/route.ts';
    let content = fs.readFileSync(webhooksPath, 'utf8');
    
    // Corrigir timestamp duplicado e vírgula
    content = content.replace(
      /(\s+timestamp: new Date\(\)\.toISOString\(\)\s*\n\s+}\s*\n\s+timestamp: new Date\(\)\.toISOString\(\))/,
      (match) => match.replace('toISOString()\n      }\n      timestamp:', 'toISOString()\n      },\n      timestamp:')
    );
    
    fs.writeFileSync(webhooksPath, content);
    console.log('✅ Fixed webhooks/route.ts - linha 225-227');
  } catch (error) {
    console.error('❌ Error fixing webhooks:', error.message);
  }
  
  // Fix 5: ai/chat/route.ts - linha 79-80
  try {
    const chatPath = 'src/app/api/ai/chat/route.ts';
    let content = fs.readFileSync(chatPath, 'utf8');
    
    // Corrigir message/intent
    content = content.replace(
      /(\s+message: sofiaResponse\.message\s*\n\s+intent: sofiaResponse\.intent,)/,
      (match) => match.replace('message\n        intent:', 'message,\n        intent:')
    );
    
    fs.writeFileSync(chatPath, content);
    console.log('✅ Fixed ai/chat/route.ts - linha 79-80');
  } catch (error) {
    console.error('❌ Error fixing chat:', error.message);
  }
  
  console.log('✅ All next specific errors fixed!');
}

fixNextErrors();