# 📋 REGRAS DE QUALIDADE TYPESCRIPT - VISA2ANY

## 🚨 REGRAS CRÍTICAS PARA EVITAR ERROS DE COMPILAÇÃO

### ⚠️ APRENDIZADOS DOS ERROS ANTERIORES (2 DIAS DE CORREÇÃO)

Este documento contém **TODAS as regras obrigatórias** baseadas nos erros que causaram 2 dias de bloqueio no deploy.

---

## 🔴 REGRA #1: AutomationLog.create() - CAMPOS OBRIGATÓRIOS

### ❌ NUNCA FAÇA ISSO:
```typescript
await prisma.automationLog.create({
  data: {
    type: 'CLIENT_CREATED',
    action: 'create_client',
    clientId: client.id
    // ❌ FALTANDO: success, details
  }
})
```

### ✅ SEMPRE FAÇA ASSIM:
```typescript
await prisma.automationLog.create({
  data: {
    type: 'CLIENT_CREATED',
    action: 'create_client',
    clientId: client.id,
    success: true,                    // ✅ OBRIGATÓRIO
    details: {                        // ✅ OBRIGATÓRIO
      timestamp: new Date().toISOString(),
      action: 'automated_action',
      // ... outros dados relevantes
    }
  }
})
```

### 📋 TEMPLATE PARA DIFERENTES TIPOS:

#### Cliente
```typescript
success: true,
details: {
  clientId: client.id,
  name: client.name,
  email: client.email,
  timestamp: new Date().toISOString()
}
```

#### Pagamento
```typescript
success: true,
details: {
  paymentId: payment.id,
  amount: payment.amount,
  clientId: payment.clientId,
  timestamp: new Date().toISOString()
}
```

#### Email/WhatsApp
```typescript
success: true,
details: {
  to: recipient,
  template: templateName,
  subject: emailSubject,
  timestamp: new Date().toISOString()
}
```

#### Erro
```typescript
success: false,
details: {
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString()
}
```

---

## 🔴 REGRA #2: CASTING DE TIPOS JSON - NUNCA USE 'as any'

### ❌ NUNCA FAÇA ISSO:
```typescript
const details = log.details as any
const country = (seq.details as any)?.sequenceType
```

### ✅ SEMPRE FAÇA ASSIM:
```typescript
const details = log.details as { documentName?: string }
const country = (seq.details as { sequenceType?: string })?.sequenceType
```

### 📋 TEMPLATES COMUNS:

#### AutomationLog details
```typescript
(log.details as { 
  timestamp?: string;
  action?: string;
  [key: string]: any;
})
```

#### WhatsApp countries
```typescript
const countries = Array.isArray(sub.countries) ? sub.countries : ['Global']
countries.forEach(country => {
  const countryKey = String(country)  // ✅ Convert to string
  countryCount[countryKey] = (countryCount[countryKey] || 0) + 1
})
```

---

## 🔴 REGRA #3: ESTRUTURA DE RESPOSTA PADRONIZADA

### ❌ NUNCA FAÇA ISSO:
```typescript
return NextResponse.json({ status: 500 })  // ❌ Sem mensagem de erro
```

### ✅ SEMPRE FAÇA ASSIM:
```typescript
return NextResponse.json(
  { 
    error: 'Mensagem descritiva do erro',
    details: error.message
  },
  { status: 500 }
)
```

---

## 🔴 REGRA #4: IMPORTS CONSISTENTES

### ✅ SEMPRE USE:
```typescript
import { prisma } from '@/lib/prisma'  // ✅ Instance compartilhada
```

### ❌ NUNCA USE:
```typescript
import { PrismaClient } from '@prisma/client'  // ❌ Nova instância
const prisma = new PrismaClient()
```

---

## 🔴 REGRA #5: TRATAMENTO DE ERROS OBRIGATÓRIO

### ✅ SEMPRE INCLUA:
```typescript
try {
  // código principal
} catch (error) {
  // Log do erro
  await prisma.automationLog.create({
    data: {
      type: 'ERROR',
      action: 'operation_failed',
      success: false,
      details: {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    }
  })
  
  console.error('Erro na operação:', error)
  return NextResponse.json(
    { error: 'Mensagem para o usuário' },
    { status: 500 }
  )
}
```

---

## 🔴 REGRA #6: VALIDAÇÃO DE SCHEMAS ZOD

### ✅ SEMPRE VALIDE:
```typescript
const validatedData = schema.parse(body)
```

### ✅ SEMPRE TRATE ERROS ZOD:
```typescript
if (error instanceof z.ZodError) {
  return NextResponse.json(
    { 
      error: 'Dados inválidos',
      details: error.errors
    },
    { status: 400 }
  )
}
```

---

## 🔴 REGRA #7: CAMPOS OBRIGATÓRIOS NO PRISMA SCHEMA

### ✅ SEMPRE VERIFIQUE SE O CAMPO É OBRIGATÓRIO:

```prisma
model AutomationLog {
  id        String   @id @default(cuid())
  type      String   // OBRIGATÓRIO
  action    String   // OBRIGATÓRIO  
  details   Json     // OBRIGATÓRIO ⚠️
  success   Boolean  // OBRIGATÓRIO ⚠️
  error     String?  // OPCIONAL
  executedAt DateTime @default(now())
  clientId  String?  // OPCIONAL
}
```

**CUIDADO**: Os campos `details` e `success` SÃO OBRIGATÓRIOS!

---

## 🔴 REGRA #8: SYNTAX CHECK OBRIGATÓRIO

### ✅ SEMPRE VERIFIQUE ANTES DO COMMIT:
1. Vírgulas em objetos
2. Parênteses fechados
3. Chaves balanceadas
4. Imports corretos

---

## 🛠️ SCRIPTS DE VERIFICAÇÃO

### Como usar os scripts:
```bash
# Verificar todos os erros
node fix-all-errors.js

# Corrigir automaticamente
node fix-automation-logs.js

# Verificar antes do commit
npm run type-check
```

---

## 📊 ESTATÍSTICAS DO PROBLEMA ANTERIOR

- **Total de erros encontrados**: 37
- **Tempo perdido**: 2 dias
- **Arquivos afetados**: 22
- **Tipos de erro**:
  - AutomationLog sem campos: 33 erros
  - Casting JSON incorreto: 4 erros
  - Imports inconsistentes: 0 erros

---

## ⚡ PREVENÇÃO

### SEMPRE execute antes de fazer commit:
1. `node validate-all.js` (script abaixo)
2. `npm run build`
3. `npm run type-check`

### NUNCA faça commit se houver:
- ❌ Erros de TypeScript
- ❌ Campos obrigatórios faltando
- ❌ Casting 'as any' 
- ❌ Respostas sem mensagem de erro

---

## 🎯 RESUMO DAS REGRAS CRÍTICAS

1. **AutomationLog**: SEMPRE incluir `success` e `details`
2. **JSON Casting**: NUNCA usar `as any`, sempre tipagem específica
3. **Respostas**: SEMPRE incluir mensagens de erro descritivas
4. **Imports**: SEMPRE usar instância compartilhada do Prisma
5. **Validação**: SEMPRE verificar antes do commit
6. **Tratamento de Erro**: SEMPRE logar e responder adequadamente

---

## 🚨 LEMBRETE FINAL

**Este documento foi criado após 2 dias de correção de erros!**

**SIGA ESTAS REGRAS RELIGIOSAMENTE para evitar bloqueios futuros!**