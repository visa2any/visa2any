const fs = require('fs');

function fixFinalErrors() {
  console.log('🔧 Fixing final batch of specific syntax errors...');
  
  // Fix 1: payments/route.ts - linha 287 (another missing comma)
  try {
    const paymentsPath = 'src/app/api/affiliates/payments/route.ts';
    let content = fs.readFileSync(paymentsPath, 'utf8');
    
    // Fix missing comma after where clause
    content = content.replace(
      /(\s+where: \{ paymentId \}\s*\n\s+data: \{)/,
      (match) => match.replace('paymentId }\\n        data:', 'paymentId },\\n        data:')
    );
    
    fs.writeFileSync(paymentsPath, content);
    console.log('✅ Fixed payments/route.ts - linha 287');
  } catch (error) {
    console.error('❌ Error fixing payments:', error.message);
  }
  
  // Fix 2: webhooks/route.ts - linha 265 (malformed function parameter)
  try {
    const webhooksPath = 'src/app/api/affiliates/webhooks/route.ts';
    let content = fs.readFileSync(webhooksPath, 'utf8');
    
    // Fix malformed function signature
    content = content.replace(
      /async function sendWebhookEvent\(,\s*\n\s*affiliateId: string,/,
      'async function sendWebhookEvent(\n  affiliateId: string,'
    );
    
    fs.writeFileSync(webhooksPath, content);
    console.log('✅ Fixed webhooks/route.ts - linha 265');
  } catch (error) {
    console.error('❌ Error fixing webhooks:', error.message);
  }
  
  // Fix 3: ai/chat/route.ts - linha 134 (missing comma in return object)
  try {
    const chatPath = 'src/app/api/ai/chat/route.ts';
    let content = fs.readFileSync(chatPath, 'utf8');
    
    // Fix missing comma in return object
    content = content.replace(
      /(\s+message: response\.message\s*\n\s+intent: intent\.name,)/,
      (match) => match.replace('message\\n    intent:', 'message,\\n    intent:')
    );
    
    fs.writeFileSync(chatPath, content);
    console.log('✅ Fixed ai/chat/route.ts - linha 134');
  } catch (error) {
    console.error('❌ Error fixing chat:', error.message);
  }
  
  // Fix 4: ai/document-analysis/route.ts - linha 19 (missing comma)
  try {
    const docPath = 'src/app/api/ai/document-analysis/route.ts';
    let content = fs.readFileSync(docPath, 'utf8');
    
    // Fix missing comma after where clause
    content = content.replace(
      /(\s+where: \{ id: validatedData\.documentId \}\s*\n\s+include: \{)/,
      (match) => match.replace('documentId }\\n      include:', 'documentId },\\n      include:')
    );
    
    fs.writeFileSync(docPath, content);
    console.log('✅ Fixed ai/document-analysis/route.ts - linha 19');
  } catch (error) {
    console.error('❌ Error fixing document-analysis:', error.message);
  }
  
  // Fix 5: analysis/save-result/route.ts - linha 10-11 (missing comma)
  try {
    const analysisPath = 'src/app/api/analysis/save-result/route.ts';
    let content = fs.readFileSync(analysisPath, 'utf8');
    
    // Fix missing comma between error object and status
    content = content.replace(
      /(\s+return NextResponse\.json\(\s*\n\s+\{ error: 'Dados inválidos' \}\s*\n\s+\{ status: 400 \})/,
      (match) => match.replace("'Dados inválidos' }\\n      { status:", "'Dados inválidos' },\\n      { status:")
    );
    
    fs.writeFileSync(analysisPath, content);
    console.log('✅ Fixed analysis/save-result/route.ts - linha 10-11');
  } catch (error) {
    console.error('❌ Error fixing analysis:', error.message);
  }
  
  console.log('✅ All final specific errors fixed!');
}

fixFinalErrors();