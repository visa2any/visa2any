const fs = require('fs');

// Função para corrigir erros específicos e precisos baseados no log atual
function fixSpecificErrors() {
  console.log('🔧 Fixing specific syntax errors from build log...');
  
  // Fix 1: notifications/route.ts - linha 251
  try {
    const notificationsPath = 'src/app/api/affiliates/notifications/route.ts';
    let content = fs.readFileSync(notificationsPath, 'utf8');
    
    // Corrigir especificamente a linha 250-251
    content = content.replace(
      /(\s+categories: \['banners', 'email_templates'\],\s*\n\s+}\s*\n\s+read: false,)/,
      (match) => match.replace('}\n      read:', '},\n      read:')
    );
    
    fs.writeFileSync(notificationsPath, content);
    console.log('✅ Fixed notifications/route.ts');
  } catch (error) {
    console.error('❌ Error fixing notifications:', error.message);
  }
  
  // Fix 2: payments/route.ts - linha 189-190
  try {
    const paymentsPath = 'src/app/api/affiliates/payments/route.ts';
    let content = fs.readFileSync(paymentsPath, 'utf8');
    
    // Corrigir especificamente where/data
    content = content.replace(
      /(\s+where: \{ id: affiliateId \}\s*\n\s+data: \{)/,
      (match) => match.replace('}\n        data:', '},\n        data:')
    );
    
    fs.writeFileSync(paymentsPath, content);
    console.log('✅ Fixed payments/route.ts');
  } catch (error) {
    console.error('❌ Error fixing payments:', error.message);
  }
  
  // Fix 3: affiliates/route.ts - linha 214-215
  try {
    const affiliatesPath = 'src/app/api/affiliates/route.ts';
    let content = fs.readFileSync(affiliatesPath, 'utf8');
    
    // Corrigir especificamente where/data
    content = content.replace(
      /(\s+where: \{ id \}\s*\n\s+data: \{)/,
      (match) => match.replace('}\n      data:', '},\n      data:')
    );
    
    fs.writeFileSync(affiliatesPath, content);
    console.log('✅ Fixed affiliates/route.ts');
  } catch (error) {
    console.error('❌ Error fixing affiliates:', error.message);
  }
  
  // Fix 4: track/route.ts - linha 148-149
  try {
    const trackPath = 'src/app/api/affiliates/track/route.ts';
    let content = fs.readFileSync(trackPath, 'utf8');
    
    // Corrigir NextResponse.json
    content = content.replace(
      /(\s+\{ error: 'Afiliado não encontrado' \}\s*\n\s+\{ status: 404 \})/,
      (match) => match.replace('}\n        {', '},\n        {')
    );
    
    fs.writeFileSync(trackPath, content);
    console.log('✅ Fixed track/route.ts');
  } catch (error) {
    console.error('❌ Error fixing track:', error.message);
  }
  
  // Fix 5: webhooks/route.ts - linha 99-100
  try {
    const webhooksPath = 'src/app/api/affiliates/webhooks/route.ts';
    let content = fs.readFileSync(webhooksPath, 'utf8');
    
    // Corrigir secret/active
    content = content.replace(
      /(\s+secret: secret \|\| generateWebhookSecret\(\)\s*\n\s+active: true,)/,
      (match) => match.replace('()\n      active:', '(),\n      active:')
    );
    
    fs.writeFileSync(webhooksPath, content);
    console.log('✅ Fixed webhooks/route.ts');
  } catch (error) {
    console.error('❌ Error fixing webhooks:', error.message);
  }
  
  console.log('✅ All specific errors fixed!');
}

fixSpecificErrors();