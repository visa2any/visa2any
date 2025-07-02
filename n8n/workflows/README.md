# N8N Workflows - Visa2Any

## 🚀 Workflows Principais (Corrigidos e Prontos)

### ✅ Workflows Essenciais
1. **zero-touch-client-journey-fixed.json** - Jornada automatizada do cliente
2. **consular-slots-monitor-corrected.json** - Monitor de vagas consulares (Vaga Express)
3. **document-processing-automation-corrected.json** - Automação de processamento de documentos
4. **payment-billing-automation-corrected.json** - Automação de pagamentos e billing

### 📋 Workflows Complementares
5. **appointment-cancellation-monitor.json** - Monitor de cancelamentos
6. **proactive-client-care.json** - Cuidado proativo com clientes
7. **revenue-optimization.json** - Otimização de receita (upsell)
8. **lead-intelligence-enrichment.json** - Enrichment de leads
9. **multi-channel-orchestration.json** - Orquestração multi-canal
10. **internal-crm-enhancement.json** - Melhorias do CRM interno

### 🔮 Workflows Especializados
11. **vaga-express-product.json** - Produto Vaga Express
12. **vaga-express-analytics.json** - Analytics do Vaga Express
13. **waitlist-management.json** - Gestão de lista de espera
14. **legal-monitor.json** - Monitor legal
15. **client-journey-fixed.json** - Jornada do cliente (versão simplificada)

## 📦 Como Importar

### No N8N:
1. Abra o N8N (http://localhost:5678)
2. Clique em "Import workflow"
3. Importe os arquivos nesta ordem:

#### Ordem Recomendada de Importação:
```
1. zero-touch-client-journey-fixed.json
2. payment-billing-automation-corrected.json  
3. consular-slots-monitor-corrected.json
4. document-processing-automation-corrected.json
5. [Demais workflows conforme necessidade]
```

## ⚙️ Pré-requisitos

### Antes de ativar os workflows:
1. **WhatsApp Baileys** - Execute: `npm run whatsapp`
2. **Database SQLite** - Já criado em `/database/visa2any.db`
3. **Variáveis de Ambiente** - Configure no N8N:
   - `VISA2ANY_API_TOKEN`
   - `GOOGLE_VISION_API_KEY` 
   - `MERCADO_PAGO_ACCESS_TOKEN`

## 🗄️ Database

- **Tipo:** SQLite
- **Localização:** `/n8n/database/visa2any.db`
- **Status:** ✅ Criado e pronto
- **Tabelas:** Serão criadas automaticamente pelos workflows

## 📱 WhatsApp Integration

- **Serviço:** Baileys (Open Source)
- **API:** http://localhost:3001
- **Status:** ✅ Configurado
- **Iniciar:** `npm run whatsapp`

---

## 🏆 Status: TODOS OS WORKFLOWS CORRIGIDOS E ORGANIZADOS

**Workflows antigos removidos** ✅  
**Apenas versões funcionais mantidas** ✅  
**Conexões todas corrigidas** ✅  
**SQLite configurado** ✅  
**WhatsApp Baileys pronto** ✅