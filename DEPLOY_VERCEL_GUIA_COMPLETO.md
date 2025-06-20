# 🚀 GUIA COMPLETO: DEPLOY VERCEL + GITHUB

## ✅ **ETAPA 1: REPOSITÓRIO GITHUB CRIADO LOCALMENTE**

### **Status Atual:**
```bash
✅ Git inicializado
✅ .gitignore configurado
✅ Primeiro commit feito
✅ 391 arquivos commitados
✅ Pronto para push para GitHub
```

---

## 📋 **ETAPA 2: CRIAR REPOSITÓRIO NO GITHUB**

### **1. Acesse GitHub:**
```
🌐 https://github.com
👤 Faça login na sua conta
```

### **2. Criar Novo Repositório:**
```
1. Clique em "New repository" (botão verde)
2. Repository name: visa2any
3. Description: "Plataforma Visa2Any - Consultoria de Imigração"
4. ✅ Public (para Vercel Hobby gratuito)
5. ❌ NÃO marque "Initialize with README"
6. ❌ NÃO adicione .gitignore 
7. ❌ NÃO adicione license
8. Clique "Create repository"
```

### **3. Copiar URL do Repositório:**
```
Após criar, você verá uma tela com comandos.
Copie a URL que aparece, algo como:
https://github.com/seu-usuario/visa2any.git
```

---

## 🔗 **ETAPA 3: CONECTAR REPOSITÓRIO LOCAL AO GITHUB**

### **Execute estes comandos no terminal (pasta visa2any):**

```bash
# 1. Adicionar origin remoto
git remote add origin https://github.com/SEU-USUARIO/visa2any.git

# 2. Verificar conexão
git remote -v

# 3. Push inicial
git push -u origin main
```

### **Se der erro de autenticação:**
```bash
# GitHub pedirá login - use:
# Username: seu-usuario-github
# Password: token-pessoal (não a senha da conta)

# Para criar token:
# GitHub > Settings > Developer settings > Personal access tokens > Generate new token
# Marque: repo, workflow, write:packages
```

---

## 🚀 **ETAPA 4: CONFIGURAR VERCEL**

### **1. Criar Conta Vercel:**
```
🌐 https://vercel.com
🔗 "Continue with GitHub" (conectar com GitHub)
✅ Autorizar Vercel a acessar seus repositórios
```

### **2. Importar Projeto:**
```
1. No dashboard Vercel: "Add New..." > "Project"
2. Selecionar "visa2any" da lista de repositórios
3. Clique "Import"
```

### **3. Configurar Deploy:**
```
Framework Preset: Next.js ✅ (detectado automaticamente)
Root Directory: ./ ✅
Build Command: npm run build ✅ 
Output Directory: .next ✅
Install Command: npm install ✅
```

### **4. Variáveis de Ambiente:**
```
Clique "Environment Variables" e adicione:

MERCADOPAGO_ACCESS_TOKEN=APP_USR-1546611726384756-061920-f19b1d80c3319ad40f489e73364f74ee-1563946768
MERCADOPAGO_PUBLIC_KEY=APP_USR-ea5f478f-d0b4-4c64-a41e-5803ad863f29
NEXTAUTH_URL=https://visa2any.vercel.app
NEXTAUTH_SECRET=visa2any-secret-key-production-2024
DATABASE_URL=file:./production.db
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=info@visa2any.com
SMTP_PASS=Tagualife4/
FROM_EMAIL=info@visa2any.com
FROM_NAME=Visa2Any
WHATSAPP_PHONE=5511519447117
WHATSAPP_BUSINESS_PHONE=(11) 5194-4717
TELEGRAM_BOT_TOKEN=8022240428:AAG0kxbybTg7F1EamXdsyp2ssO0tsSk4lt4
TELEGRAM_CHAT_ID=2067509004
NODE_ENV=production
```

### **5. Deploy:**
```
Clique "Deploy" ✅
Aguarde build (2-5 minutos)
```

---

## 🌐 **ETAPA 5: CONFIGURAR DOMÍNIO CUSTOM**

### **1. Após Deploy Sucesso:**
```
✅ Site funcionando em: https://visa2any.vercel.app
🎯 Agora configurar domínio custom
```

### **2. No Vercel Dashboard:**
```
1. Projeto "visa2any" > "Settings" > "Domains"
2. Adicionar: visa2any.com
3. Adicionar: www.visa2any.com
4. Vercel mostrará registros DNS necessários
```

### **3. No Painel Hostinger:**
```
1. Acesse painel Hostinger
2. Zona DNS do domínio visa2any.com
3. Adicione/edite registros:

Tipo    Nome    Valor                          TTL
A       @       76.76.19.61                   3600
CNAME   www     cname.vercel-dns.com.         3600
```

### **4. Aguardar Propagação:**
```
⏱️ 15-60 minutos para SSL automático
✅ Certificado Let's Encrypt automático
🔒 HTTPS funcionando
```

---

## 🔧 **ETAPA 6: ATUALIZAR N8N WEBHOOKS**

### **Após domínio funcionando, atualize N8N:**

```
URLs antigas (localhost):
http://localhost:3000/api/payments/webhook/mercadopago

URLs novas (produção):
https://visa2any.com/api/payments/webhook/mercadopago
https://visa2any.com/api/n8n/webhook
https://visa2any.com/api/notifications/whatsapp
```

---

## 📊 **ETAPA 7: VERIFICAR FUNCIONAMENTO**

### **Checklist Final:**
```
🌐 Site carregando: https://visa2any.com
🛒 Checkout funcionando: https://visa2any.com/checkout-wizard
💳 MercadoPago integrando corretamente
📱 N8N webhooks atualizados
📧 Emails sendo enviados
📈 Analytics funcionando
```

---

## 🔄 **PROCESSO DE ATUALIZAÇÃO FUTURO**

### **Para futuras alterações:**
```bash
# 1. Fazer alterações localmente
# 2. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 3. Vercel detecta automaticamente
# 4. Build e deploy automático
# 5. Site atualizado em 2-3 minutos
```

---

## 💰 **MONITORAMENTO DE USO**

### **Vercel Dashboard:**
```
📊 Functions Executions (limite: 1000/dia)
📈 Bandwidth Usage (limite: 100GB/mês)
🚀 Build Minutes (ilimitado no Hobby)
⚡ Edge Requests (ilimitado)
```

### **Alertas:**
```
✅ 80% do limite: Email automático
⚠️ 90% do limite: Considerar upgrade
🚨 100% do limite: Site pode ficar offline
```

---

## 🎯 **PRÓXIMOS PASSOS APÓS DEPLOY**

### **1. Teste Completo:**
```
✅ Navegação completa
✅ Checkout real
✅ Formulários de contato
✅ N8N workflows
✅ WhatsApp integração
```

### **2. SEO e Analytics:**
```
📊 Google Analytics 4
🔍 Google Search Console
📈 Vercel Analytics (incluso)
```

### **3. Backup e Monitoramento:**
```
🔄 Backup automático (Git)
📊 Uptime monitoring
🚨 Error tracking (Vercel incluso)
```

---

## ✅ **RESUMO: ECONOMIA E BENEFÍCIOS**

### **Custo Mensal:**
```
Antes (Hostinger): R$ 30-50/mês
Agora (Vercel + DNS): R$ 15/mês
Economia: R$ 15-35/mês = R$ 180-420/ano
```

### **Benefícios Ganhos:**
```
🚀 Performance 10x melhor
⚡ Deploy automático
🔄 Zero downtime
📊 Analytics incluso
🛡️ SSL automático
🌍 CDN global
📈 Escalabilidade automática
```

**🎉 RESULTADO: Site mais rápido, confiável e barato!**