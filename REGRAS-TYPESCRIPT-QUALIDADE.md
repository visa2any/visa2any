# 📋 REGRAS DE QUALIDADE TYPESCRIPT - VISA2ANY

## 🚨 REGRAS CRÍTICAS PARA EVITAR ERROS DE COMPILAÇÃO

### ⚠️ APRENDIZADOS DOS ERROS ANTERIORES (2 DIAS DE CORREÇÃO)

Este documento contém **TODAS as regras obrigatórias** baseadas nos erros que causaram 2 dias de bloqueio no deploy.

**STATUS ATUAL**: 59 erros ainda presentes (27 AutomationLog + 9 JSON casting + 22 response format + 1 Zod)

---

## 🔥 ERROS CRÍTICOS ATUAIS QUE BLOQUEIAM BUILD

### ❌ 27 ERROS DE AUTOMATIONLOG.CREATE() - BLOQUEIAM COMPILAÇÃO

**Arquivos com erros críticos:**
```
❌ src/app/api/advisory/compliance/route.ts
❌ src/app/api/advisory/engine/route.ts  
❌ src/app/api/automation/behavioral-triggers/route.ts
❌ src/app/api/clients/[id]/route.ts (2 instâncias)
❌ src/app/api/clients/route.ts
❌ src/app/api/consultations/[id]/route.ts (3 instâncias)
❌ src/app/api/consultations/route.ts
❌ src/app/api/interactions/route.ts
❌ src/app/api/leads/capture/route.ts
❌ src/app/api/ml/lead-scoring/route.ts
❌ src/app/api/n8n/webhook/route.ts (2 instâncias)
❌ src/app/api/payments/[id]/route.ts (4 instâncias)
❌ src/app/api/payments/create-order/route.ts
❌ src/app/api/payments/route.ts
❌ src/app/api/payments/webhook/mercadopago/route.ts (4 instâncias)
❌ src/app/api/quality/assurance/route.ts
❌ src/app/api/visa-analysis/route.ts
```

### ⚠️ 9 ERROS DE JSON CASTING - PODEM CAUSAR RUNTIME ERRORS

**Arquivos com 'as any' perigosos:**
```
⚠️ src/app/api/advisory/compliance/route.ts
⚠️ src/app/api/advisory/engine/route.ts
⚠️ src/app/api/ai/chat/route.ts
⚠️ src/app/api/ai/document-analysis/route.ts
⚠️ src/app/api/auth/logout/route.ts
⚠️ src/app/api/blog/comment/route.ts
⚠️ src/app/api/payments/[id]/route.ts
⚠️ src/app/api/payments/webhook/mercadopago/route.ts
⚠️ src/app/api/quality/assurance/route.ts
```

### 💡 22 PROBLEMAS DE RESPONSE FORMAT - EXPERIÊNCIA DO USUÁRIO

**Arquivos com respostas de erro sem mensagem:**
```
💡 src/app/api/ai/document-analysis/route.ts
💡 src/app/api/auth/login/route.ts
💡 src/app/api/auth/me/route.ts
💡 src/app/api/auth/unified/me/route.ts
💡 src/app/api/automation/nurturing/route.ts
💡 src/app/api/blog/bookmark/route.ts
💡 src/app/api/blog/comment/route.ts
💡 src/app/api/blog/like/route.ts
💡 src/app/api/clients/[id]/route.ts
💡 src/app/api/communications/send/route.ts
💡 src/app/api/consultations/[id]/route.ts
💡 src/app/api/consultations/route.ts
💡 src/app/api/dashboard/stats/route.ts
💡 src/app/api/interactions/route.ts
💡 src/app/api/medical-exams/[bookingId]/route.ts
💡 src/app/api/n8n/webhook/route.ts
💡 src/app/api/notifications/system/route.ts
💡 src/app/api/payments/[id]/route.ts
💡 src/app/api/payments/route.ts
💡 src/app/api/payments/webhook/mercadopago/route.ts
💡 src/app/api/quality/assurance/route.ts
💡 src/app/api/visa-analysis/route.ts
```

### 🔧 1 ERRO ZOD - PODE CAUSAR RUNTIME ERROR

**Arquivo sem tratamento ZodError:**
```
🔧 src/app/api/vaga-express/route.ts - Parse sem tratamento ZodError
```

---

## 🚨 OUTROS POTENCIAIS PROBLEMAS DE BUILD

### 🔴 VÍRGULAS EXTRAS E SYNTAX ERRORS

**Detectados em arquivos corrigidos automaticamente:**
- Vírgulas extras no final de objetos causam erros de sintaxe
- Parênteses não balanceados em funções Prisma
- Statements sem return em catch blocks

### 🔴 IMPORTS PROBLEMÁTICOS

**Potenciais problemas:**
```typescript
// ❌ PERIGOSO - Pode não resolver em production
import { something } from '../../../lib/utils'

// ❌ PERIGOSO - Pode causar circular dependency  
import { prisma } from '../../lib/prisma'

// ✅ CORRETO - Sempre use path alias
import { something } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
```

### 🔴 TYPES MISSING - PODEM QUEBRAR EM PRODUCTION

**Verificar se existem:**
```typescript
// Verificar se @types estão instalados
@types/node
@types/react
@types/bcryptjs
@types/jsonwebtoken

// Verificar se tipos customizados estão definidos
declare module 'some-package'
```

### 🔴 ENV VARIABLES - PODEM QUEBRAR RUNTIME

**Verificar se todas estão definidas:**
```typescript
// Estas DEVEM estar no .env e no Vercel
DATABASE_URL
NEXTAUTH_SECRET  
NEXTAUTH_URL
N8N_WEBHOOK_SECRET
MERCADOPAGO_ACCESS_TOKEN
```

### 🔴 PRISMA SCHEMA MISMATCHES

**Potenciais problemas detectados:**
```typescript
// Campo usado no código mas não existe no schema
orderBy: { createdAt: 'desc' } // Se schema tem executedAt

// Campos obrigatórios não fornecidos
await prisma.automationLog.create({
  data: {
    type: 'TEST',
    action: 'test'
    // FALTANDO: success, details (obrigatórios no schema)
  }
})
```

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

## 📊 ESTATÍSTICAS COMPLETAS

### 🔥 PROBLEMAS ORIGINAIS (2 DIAS DE DEBUG)
- **Total de erros encontrados inicialmente**: 37
- **Tempo perdido**: 2 dias
- **Arquivos afetados**: 22
- **Tipos de erro originais**:
  - AutomationLog sem campos: 33 erros
  - Casting JSON incorreto: 4 erros
  - Imports inconsistentes: 0 erros

### ✅ PROGRESSO ATUAL
- **Erros corrigidos automaticamente**: 182
  - ✅ Response format: 50 corrigidos
  - ✅ Imports inconsistentes: 23 corrigidos  
  - ✅ Syntax errors: 109 corrigidos
- **Erros ainda pendentes**: 59
  - ❌ AutomationLog críticos: 27 (BLOQUEIAM BUILD)
  - ⚠️ JSON casting perigosos: 9
  - 💡 Response format: 22
  - 🔧 Zod sem tratamento: 1

### 🎯 TAXA DE SUCESSO
- **Total identificado**: 241 erros
- **Corrigidos**: 182 (75.5%)
- **Pendentes**: 59 (24.5%)
- **Críticos que bloqueiam build**: 27

---

## ⚡ PREVENÇÃO

### ✅ CHECKLIST OBRIGATÓRIO ANTES DO COMMIT

#### 1. 🔍 VALIDAÇÃO AUTOMÁTICA
```bash
# SEMPRE execute NESTA ORDEM:
npm run validate          # Verificação rápida (30 segundos)
npm run validate:full     # Verificação completa (2 minutos)
npm run fix:auto          # Correção automática se houver erros
npm run type-check        # Verificação TypeScript
npm run build             # Build completo
```

#### 2. ⚠️ VERIFICAÇÕES MANUAIS CRÍTICAS

**AutomationLog.create() - ZERO TOLERÂNCIA:**
```bash
# Procurar por calls sem success/details
grep -r "automationLog.create" src/ | grep -v "success:" | grep -v "details:"
```

**Imports relativos perigosos:**
```bash
# Procurar por imports relativos profundos
grep -r "from.*\.\./\.\./\.\." src/
```

**Variáveis de ambiente faltando:**
```bash
# Verificar se todas as env vars estão definidas
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL
```

#### 3. 🚨 NUNCA FAÇA COMMIT SE HOUVER:
- ❌ Erros de TypeScript (`npm run type-check` falhando)
- ❌ Build falhando (`npm run build` falhando)
- ❌ AutomationLog sem campos obrigatórios
- ❌ Casting 'as any' em tipos JSON críticos
- ❌ Respostas de erro sem mensagem descritiva
- ❌ Imports usando paths relativos profundos
- ❌ Variáveis de ambiente não definidas

#### 4. 🔒 VALIDAÇÃO DE PRODUÇÃO
```bash
# Teste se o build está otimizado
npm run build && ls -la .next/

# Verificar se não há warnings críticos
npm run build 2>&1 | grep -i "error\|failed\|critical"
```

---

## 🎯 RESUMO DAS REGRAS CRÍTICAS

### 🔴 REGRAS QUE BLOQUEIAM BUILD (ZERO TOLERÂNCIA)
1. **AutomationLog**: SEMPRE incluir `success` e `details` (27 erros ativos)
2. **Prisma Schema**: SEMPRE usar campos corretos (`executedAt` não `createdAt`)
3. **Syntax**: NUNCA deixar vírgulas extras ou parênteses não balanceados
4. **TypeScript**: SEMPRE resolver erros de compilação antes do commit

### ⚠️ REGRAS DE ALTA PRIORIDADE (PODEM QUEBRAR RUNTIME)
5. **JSON Casting**: NUNCA usar `as any`, sempre tipagem específica (9 erros ativos)
6. **Zod Validation**: SEMPRE tratar ZodError em try/catch (1 erro ativo)
7. **Env Variables**: SEMPRE verificar se estão definidas em production
8. **Imports**: SEMPRE usar path aliases (@/) ao invés de relativos

### 💡 REGRAS DE QUALIDADE (EXPERIÊNCIA DO USUÁRIO)
9. **Respostas**: SEMPRE incluir mensagens de erro descritivas (22 erros ativos)
10. **Error Handling**: SEMPRE logar erros e responder adequadamente
11. **Types**: SEMPRE definir tipos ao invés de `any`

---

## 🚨 AÇÃO IMEDIATA NECESSÁRIA

### ❌ CRÍTICO - 27 ERROS BLOQUEIAM BUILD
**Estes DEVEM ser corrigidos ANTES do próximo deploy:**
```bash
npm run validate                    # Ver lista completa
npm run fix:auto                   # Tentar correção automática
```

**Se auto-fix não resolver, corrigir manualmente cada arquivo listado acima.**

### ⏰ PRÓXIMOS PASSOS
1. **AGORA**: Corrigir 27 erros de AutomationLog
2. **EM SEGUIDA**: Corrigir 9 erros de JSON casting
3. **DEPOIS**: Melhorar 22 mensagens de erro
4. **SEMPRE**: Usar checklist antes de cada commit

---

## 🏆 CONQUISTAS OBTIDAS

✅ **182 erros corrigidos automaticamente**  
✅ **Sistema de validação automática criado**  
✅ **Scripts de correção automática funcionando**  
✅ **Documentação completa de regras**  
✅ **Processo de prevenção estabelecido**  

**Redução de 2 dias de debug para minutos de validação automática!**

---

## 🚨 LEMBRETE FINAL

**Este documento foi criado após 2 dias de correção de erros custosos!**

**Status**: 59 erros ainda presentes, 27 críticos bloqueiam build

**SIGA ESTAS REGRAS RELIGIOSAMENTE para evitar bloqueios futuros!**

**EXECUTE `npm run validate` ANTES DE CADA COMMIT!**