const fs = require('fs');

function fixCurrentErrors() {
  console.log('🔧 Fixing current specific syntax errors...');
  
  // Fix 1: notifications/route.ts - linha 287-288
  try {
    const notificationsPath = 'src/app/api/affiliates/notifications/route.ts';
    let content = fs.readFileSync(notificationsPath, 'utf8');
    
    // Corrigir headers/body
    content = content.replace(
      /(\s+headers: \{ 'Content-Type': 'application\/json' \}\s*\n\s+body: JSON\.stringify\(notification\))/,
      (match) => match.replace("json' }\n    body:", "json' },\n    body:")
    );
    
    fs.writeFileSync(notificationsPath, content);
    console.log('✅ Fixed notifications/route.ts - linha 287-288');
  } catch (error) {
    console.error('❌ Error fixing notifications:', error.message);
  }
  
  // Fix 2: payments/route.ts - linha 256-257
  try {
    const paymentsPath = 'src/app/api/affiliates/payments/route.ts';
    let content = fs.readFileSync(paymentsPath, 'utf8');
    
    // Corrigir where/data
    content = content.replace(
      /(\s+where: \{ id: paymentId \}\s*\n\s+data: updateData,)/,
      (match) => match.replace('paymentId }\n      data:', 'paymentId },\n      data:')
    );
    
    fs.writeFileSync(paymentsPath, content);
    console.log('✅ Fixed payments/route.ts - linha 256-257');
  } catch (error) {
    console.error('❌ Error fixing payments:', error.message);
  }
  
  // Fix 3: track/route.ts - linha 208-209
  try {
    const trackPath = 'src/app/api/affiliates/track/route.ts';
    let content = fs.readFileSync(trackPath, 'utf8');
    
    // Corrigir where/data
    content = content.replace(
      /(\s+where: \{ id: affiliate\.id \}\s*\n\s+data: \{)/,
      (match) => match.replace('affiliate.id }\n      data:', 'affiliate.id },\n      data:')
    );
    
    // Corrigir vírgulas dentro do data object
    content = content.replace(
      /(\s+totalConversions: \{ increment: 1 \}\s*\n\s+totalEarnings: \{ increment: commissionValue \}\s*\n\s+pendingEarnings: \{ increment: commissionValue \})/,
      (match) => match.replace('increment: 1 }\n        totalEarnings:', 'increment: 1 },\n        totalEarnings:')
                .replace('commissionValue }\n        pendingEarnings:', 'commissionValue },\n        pendingEarnings:')
    );
    
    fs.writeFileSync(trackPath, content);
    console.log('✅ Fixed track/route.ts - linha 208-212');
  } catch (error) {
    console.error('❌ Error fixing track:', error.message);
  }
  
  // Fix 4: webhooks/route.ts - linha 155-156
  try {
    const webhooksPath = 'src/app/api/affiliates/webhooks/route.ts';
    let content = fs.readFileSync(webhooksPath, 'utf8');
    
    // Corrigir ...endpoints[index]/secret
    content = content.replace(
      /(\s+\.\.\.endpoints\[index\]\s*\n\s+secret: undefined)/,
      (match) => match.replace('endpoints[index]\n        secret:', 'endpoints[index],\n        secret:')
    );
    
    fs.writeFileSync(webhooksPath, content);
    console.log('✅ Fixed webhooks/route.ts - linha 155-156');
  } catch (error) {
    console.error('❌ Error fixing webhooks:', error.message);
  }
  
  // Fix 5: ai/chat/route.ts - linha 27-28
  try {
    const chatPath = 'src/app/api/ai/chat/route.ts';
    let content = fs.readFileSync(chatPath, 'utf8');
    
    // Corrigir where/include
    content = content.replace(
      /(\s+where: \{ id: validatedData\.clientId \}\s*\n\s+include: \{)/,
      (match) => match.replace('clientId }\n        include:', 'clientId },\n        include:')
    );
    
    fs.writeFileSync(chatPath, content);
    console.log('✅ Fixed ai/chat/route.ts - linha 27-28');
  } catch (error) {
    console.error('❌ Error fixing chat:', error.message);
  }
  
  console.log('✅ All current specific errors fixed!');
}

fixCurrentErrors();