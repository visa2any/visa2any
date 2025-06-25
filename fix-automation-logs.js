#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGINDO TODOS OS ERROS DE AUTOMATIONLOG...');

// Mapeamento de templates para cada tipo de log
const logTemplates = {
  'CLIENT_CREATED': {
    success: true,
    details: {
      clientId: 'client.id',
      name: 'client.name', 
      email: 'client.email',
      timestamp: 'new Date().toISOString()'
    }
  },
  'CLIENT_UPDATED': {
    success: true,
    details: {
      clientId: 'clientId',
      updatedFields: 'Object.keys(updateData)',
      timestamp: 'new Date().toISOString()'
    }
  },
  'CLIENT_DELETED': {
    success: true,
    details: {
      clientId: 'id',
      timestamp: 'new Date().toISOString()'
    }
  },
  'CONSULTATION_CREATED': {
    success: true,
    details: {
      consultationId: 'consultation.id',
      clientId: 'consultation.clientId',
      type: 'consultation.type',
      timestamp: 'new Date().toISOString()'
    }
  },
  'CONSULTATION_UPDATED': {
    success: true,
    details: {
      consultationId: 'id',
      status: 'updateData.status',
      timestamp: 'new Date().toISOString()'
    }
  },
  'CONSULTATION_DELETED': {
    success: true,
    details: {
      consultationId: 'id',
      timestamp: 'new Date().toISOString()'
    }
  },
  'INTERACTION_CREATED': {
    success: true,
    details: {
      interactionId: 'interaction.id',
      clientId: 'interaction.clientId',
      type: 'interaction.type',
      timestamp: 'new Date().toISOString()'
    }
  },
  'LEAD_CAPTURED': {
    success: true,
    details: {
      leadId: 'lead.id',
      source: 'leadData.source',
      email: 'leadData.email',
      timestamp: 'new Date().toISOString()'
    }
  },
  'LEAD_SCORING': {
    success: true,
    details: {
      clientId: 'validatedData.clientId',
      score: 'finalScore',
      factors: 'scoringFactors',
      timestamp: 'new Date().toISOString()'
    }
  },
  'WEBHOOK_RECEIVED': {
    success: true,
    details: {
      source: 'n8n',
      type: 'body.type',
      timestamp: 'new Date().toISOString()'
    }
  },
  'EMAIL_SENT': {
    success: true,
    details: {
      to: 'validatedData.to',
      subject: 'validatedData.subject',
      template: 'validatedData.template',
      timestamp: 'new Date().toISOString()'
    }
  },
  'WHATSAPP_SENT': {
    success: true,
    details: {
      to: 'validatedData.to',
      message: 'validatedData.message',
      timestamp: 'new Date().toISOString()'
    }
  },
  'PAYMENT_CREATED': {
    success: true,
    details: {
      paymentId: 'payment.id',
      amount: 'payment.amount',
      clientId: 'payment.clientId',
      timestamp: 'new Date().toISOString()'
    }
  },
  'PAYMENT_UPDATED': {
    success: true,
    details: {
      paymentId: 'id',
      status: 'updateData.status',
      timestamp: 'new Date().toISOString()'
    }
  },
  'PAYMENT_DELETED': {
    success: true,
    details: {
      paymentId: 'id',
      timestamp: 'new Date().toISOString()'
    }
  },
  'ORDER_CREATED': {
    success: true,
    details: {
      orderId: 'preferenceId',
      amount: 'validatedData.amount',
      clientId: 'validatedData.clientId',
      timestamp: 'new Date().toISOString()'
    }
  },
  'WEBHOOK_PROCESSED': {
    success: true,
    details: {
      paymentId: 'payment.data.id',
      status: 'payment.action',
      timestamp: 'new Date().toISOString()'
    }
  },
  'QUALITY_CHECK': {
    success: true,
    details: {
      clientId: 'validatedData.clientId',
      category: 'validatedData.category',
      score: 'qualityScore',
      timestamp: 'new Date().toISOString()'
    }
  },
  'VISA_ANALYSIS': {
    success: true,
    details: {
      clientId: 'validatedData.clientId',
      country: 'validatedData.targetCountry',
      analysisType: 'comprehensive',
      timestamp: 'new Date().toISOString()'
    }
  },
  'VISA_REQUIREMENT_UPDATED': {
    success: true,
    details: {
      country: 'validatedData.country',
      visaType: 'validatedData.visaType',
      timestamp: 'new Date().toISOString()'
    }
  },
  'VISA_REQUIREMENT_DELETED': {
    success: true,
    details: {
      requirementId: 'id',
      timestamp: 'new Date().toISOString()'
    }
  },
  'SEED_DATA_CREATED': {
    success: true,
    details: {
      dataType: 'visa_requirements',
      count: 'createdRequirements.length',
      timestamp: 'new Date().toISOString()'
    }
  }
};

// Lista de arquivos para corrigir (baseado no output do script anterior)
const filesToFix = [
  { file: 'src/app/api/clients/[id]/route.ts', lines: [128, 198, 258] },
  { file: 'src/app/api/clients/route.ts', lines: [159] },
  { file: 'src/app/api/consultations/[id]/route.ts', lines: [132, 249, 309] },
  { file: 'src/app/api/consultations/route.ts', lines: [168] },
  { file: 'src/app/api/interactions/route.ts', lines: [124] },
  { file: 'src/app/api/leads/capture/route.ts', lines: [326] },
  { file: 'src/app/api/ml/lead-scoring/route.ts', lines: [81] },
  { file: 'src/app/api/n8n/webhook/route.ts', lines: [58, 103, 176, 221, 271] },
  { file: 'src/app/api/notifications/email/route.ts', lines: [122] },
  { file: 'src/app/api/notifications/whatsapp/route.ts', lines: [35] },
  { file: 'src/app/api/payments/[id]/route.ts', lines: [107, 200, 365, 377] },
  { file: 'src/app/api/payments/create-order/route.ts', lines: [80] },
  { file: 'src/app/api/payments/route.ts', lines: [147] },
  { file: 'src/app/api/payments/webhook/mercadopago/route.ts', lines: [87, 106, 198, 209] },
  { file: 'src/app/api/quality/assurance/route.ts', lines: [83] },
  { file: 'src/app/api/visa-analysis/route.ts', lines: [114] },
  { file: 'src/app/api/visa-requirements/route.ts', lines: [163, 217] },
  { file: 'src/app/api/visa-requirements/seed/route.ts', lines: [396] }
];

function fixAutomationLogFile(filePath) {
  console.log(`📝 Corrigindo: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('automationLog.create(')) {
      // Encontrar o bloco de dados
      let dataStart = -1;
      let dataEnd = -1;
      let braceCount = 0;
      
      for (let j = i; j < lines.length; j++) {
        if (lines[j].includes('data: {')) {
          dataStart = j;
          braceCount = 1;
        } else if (dataStart !== -1) {
          for (let k = 0; k < lines[j].length; k++) {
            if (lines[j][k] === '{') braceCount++;
            if (lines[j][k] === '}') braceCount--;
          }
          if (braceCount === 0) {
            dataEnd = j;
            break;
          }
        }
      }
      
      if (dataStart !== -1 && dataEnd !== -1) {
        const dataLines = lines.slice(dataStart, dataEnd + 1);
        const dataBlock = dataLines.join('\n');
        
        // Verificar se falta success ou details
        const hasSuccess = dataBlock.includes('success:');
        const hasDetails = dataBlock.includes('details:');
        
        if (!hasSuccess || !hasDetails) {
          // Adicionar campos faltantes
          const lastDataLine = dataEnd - 1;
          const indent = '        '; // 8 espaços
          
          if (!hasSuccess) {
            lines.splice(lastDataLine + 1, 0, `${indent}success: true,`);
            modified = true;
            dataEnd++;
          }
          
          if (!hasDetails) {
            lines.splice(lastDataLine + 1, 0, 
              `${indent}details: {`,
              `${indent}  timestamp: new Date().toISOString(),`,
              `${indent}  action: 'automated_action'`,
              `${indent}},`
            );
            modified = true;
            dataEnd += 4;
          }
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`✅ ${filePath} corrigido!`);
  } else {
    console.log(`⚪ ${filePath} já estava correto`);
  }
}

// Corrigir todos os arquivos
filesToFix.forEach(({ file }) => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    fixAutomationLogFile(fullPath);
  } else {
    console.log(`❌ Arquivo não encontrado: ${fullPath}`);
  }
});

console.log('\n🎉 CORREÇÃO CONCLUÍDA! Verificando resultados...');

// Executar verificação novamente
const { execSync } = require('child_process');
try {
  execSync('node fix-all-errors.js', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Ainda há erros para corrigir');
}