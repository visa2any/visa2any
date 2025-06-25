const fs = require('fs');

function fixLatestErrors() {
  console.log('🔧 Fixing latest specific syntax errors...');
  
  // Fix 1: notifications/route.ts - linha 265-266
  try {
    const notificationsPath = 'src/app/api/affiliates/notifications/route.ts';
    let content = fs.readFileSync(notificationsPath, 'utf8');
    
    // Corrigir linha 265: adicionar vírgula após }
    content = content.replace(
      /(\s+dueDate: '2024-07-15'\s*\n\s+}\s*\n\s+read: true,)/,
      (match) => match.replace('}\n      read:', '},\n      read:')
    );
    
    // Corrigir linha 267-268: adicionar vírgulas
    content = content.replace(
      /(\s+createdAt: new Date\(now\.getTime\(\) - 12 \* 60 \* 60 \* 1000\)\.toISOString\(\)\s*\n\s+priority: 'medium')/,
      (match) => match.replace('toISOString()\n      priority:', 'toISOString(),\n      priority:')
    );
    
    fs.writeFileSync(notificationsPath, content);
    console.log('✅ Fixed notifications/route.ts - linha 265-268');
  } catch (error) {
    console.error('❌ Error fixing notifications:', error.message);
  }
  
  // Fix 2: payments/route.ts - linha 203-204
  try {
    const paymentsPath = 'src/app/api/affiliates/payments/route.ts';
    let content = fs.readFileSync(paymentsPath, 'utf8');
    
    // Corrigir payments/message
    content = content.replace(
      /(\s+payments\s*\n\s+message: `\$\{payments\.length\} pagamento\(s\) criado\(s\) com sucesso`,)/,
      (match) => match.replace('payments\n        message:', 'payments,\n        message:')
    );
    
    fs.writeFileSync(paymentsPath, content);
    console.log('✅ Fixed payments/route.ts - linha 203-204');
  } catch (error) {
    console.error('❌ Error fixing payments:', error.message);
  }
  
  // Fix 3: track/route.ts - linha 156-157
  try {
    const trackPath = 'src/app/api/affiliates/track/route.ts';
    let content = fs.readFileSync(trackPath, 'utf8');
    
    // Corrigir affiliateId/clientId
    content = content.replace(
      /(\s+affiliateId: affiliate\.id\s*\n\s+clientId,)/,
      (match) => match.replace('affiliate.id\n        clientId,', 'affiliate.id,\n        clientId,')
    );
    
    fs.writeFileSync(trackPath, content);
    console.log('✅ Fixed track/route.ts - linha 156-157');
  } catch (error) {
    console.error('❌ Error fixing track:', error.message);
  }
  
  // Fix 4: webhooks/route.ts - linha 114-115
  try {
    const webhooksPath = 'src/app/api/affiliates/webhooks/route.ts';
    let content = fs.readFileSync(webhooksPath, 'utf8');
    
    // Corrigir ...endpoint/secret
    content = content.replace(
      /(\s+\.\.\.endpoint\s*\n\s+secret: undefined, \/\/ Não retornar o secret)/,
      (match) => match.replace('...endpoint\n        secret:', '...endpoint,\n        secret:')
    );
    
    fs.writeFileSync(webhooksPath, content);
    console.log('✅ Fixed webhooks/route.ts - linha 114-115');
  } catch (error) {
    console.error('❌ Error fixing webhooks:', error.message);
  }
  
  // Fix 5: ai/chat/route.ts - linha 7-8
  try {
    const chatPath = 'src/app/api/ai/chat/route.ts';
    let content = fs.readFileSync(chatPath, 'utf8');
    
    // Corrigir message/clientId
    content = content.replace(
      /(\s+message: z\.string\(\)\.min\(1, 'Mensagem é obrigatória'\)\s*\n\s+clientId: z\.string\(\)\.optional\(\))/,
      (match) => match.replace("obrigatória')\n  clientId:", "obrigatória'),\n  clientId:")
    );
    
    fs.writeFileSync(chatPath, content);
    console.log('✅ Fixed ai/chat/route.ts - linha 7-8');
  } catch (error) {
    console.error('❌ Error fixing chat:', error.message);
  }
  
  console.log('✅ All latest specific errors fixed!');
}

fixLatestErrors();