-- TABELAS ESPECÍFICAS PARA O PRODUTO VAGA EXPRESS
-- Execute após o schema principal

-- ==================================================
-- PRODUTO VAGA EXPRESS
-- ==================================================

-- Assinaturas do Vaga Express
CREATE TABLE IF NOT EXISTS vaga_express_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id TEXT UNIQUE NOT NULL,
    client_id INTEGER NOT NULL,
    plan TEXT NOT NULL, -- BASIC, PREMIUM, VIP
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'BRL',
    payment_status TEXT DEFAULT 'COMPLETED',
    country TEXT NOT NULL,
    consulate TEXT NOT NULL,
    visa_type TEXT,
    current_appointment_date TEXT,
    preferred_date_start TEXT,
    preferred_date_end TEXT,
    urgency_level TEXT DEFAULT 'MEDIUM',
    
    -- Configurações do Plano
    monitoring_days INTEGER NOT NULL,
    max_countries INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 2, -- 1=LOW, 2=MEDIUM, 3=HIGH, 4=URGENT
    notification_channels TEXT, -- JSON: ["whatsapp", "email", "sms"]
    advance_days INTEGER DEFAULT 30, -- Máximo de dias de antecedência
    features TEXT, -- JSON: ["basic_monitoring", "guarantee", etc]
    
    -- Controle de Ativação
    activation_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED, FULFILLED
    
    -- Métricas de Uso
    slots_found INTEGER DEFAULT 0,
    notifications_sent INTEGER DEFAULT 0,
    last_notification_sent TEXT,
    success_date TEXT, -- Data que conseguiu a vaga
    
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Fila de Consultoria VIP
CREATE TABLE IF NOT EXISTS vip_consultancy_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    consultancy_type TEXT DEFAULT 'VIP_VAGA_EXPRESS',
    priority TEXT DEFAULT 'HIGH', -- LOW, MEDIUM, HIGH, URGENT
    scheduled_for TEXT NOT NULL,
    consultant_assigned INTEGER,
    notes TEXT,
    status TEXT DEFAULT 'SCHEDULED', -- SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    
    -- Dados da Consultoria
    meeting_link TEXT,
    meeting_duration INTEGER DEFAULT 60, -- minutos
    completion_notes TEXT,
    client_satisfaction INTEGER, -- 1-5 rating
    
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (consultant_assigned) REFERENCES consultants(id)
);

-- Histórico de Vagas Encontradas para Vaga Express
CREATE TABLE IF NOT EXISTS vaga_express_slot_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    country TEXT NOT NULL,
    consulate TEXT NOT NULL,
    slot_date TEXT NOT NULL,
    slot_time TEXT,
    original_appointment_date TEXT,
    advance_days INTEGER, -- Quantos dias foi antecipado
    
    -- Status da Oportunidade
    offered_at TEXT DEFAULT (datetime('now')),
    client_response TEXT, -- ACCEPTED, DECLINED, NO_RESPONSE
    response_time_minutes INTEGER,
    booking_successful INTEGER DEFAULT 0,
    
    -- Dados da Notificação
    notification_method TEXT, -- whatsapp, email, sms, phone
    urgency_level TEXT,
    
    FOREIGN KEY (subscription_id) REFERENCES vaga_express_subscriptions(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Métricas de Performance do Vaga Express
CREATE TABLE IF NOT EXISTS vaga_express_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL,
    
    -- Vendas do Dia
    basic_sales INTEGER DEFAULT 0,
    premium_sales INTEGER DEFAULT 0,
    vip_sales INTEGER DEFAULT 0,
    total_revenue REAL DEFAULT 0,
    
    -- Performance Operacional
    slots_detected INTEGER DEFAULT 0,
    notifications_sent INTEGER DEFAULT 0,
    successful_bookings INTEGER DEFAULT 0,
    client_satisfaction_avg REAL DEFAULT 0,
    
    -- Conversão
    conversion_rate REAL DEFAULT 0, -- % de clientes que conseguiram vaga
    avg_advance_days REAL DEFAULT 0, -- Média de dias antecipados
    response_time_avg INTEGER DEFAULT 0, -- Tempo médio de resposta em minutos
    
    -- Cancelamentos e Reembolsos
    cancellations INTEGER DEFAULT 0,
    refunds INTEGER DEFAULT 0,
    refund_amount REAL DEFAULT 0,
    
    created_at TEXT DEFAULT (datetime('now'))
);

-- Configurações de Preço Dinâmico (Futuro)
CREATE TABLE IF NOT EXISTS vaga_express_pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan TEXT NOT NULL, -- BASIC, PREMIUM, VIP
    country TEXT NOT NULL,
    consulate TEXT,
    
    -- Preços por Contexto
    base_price REAL NOT NULL,
    surge_multiplier REAL DEFAULT 1.0, -- Multiplicador por demanda
    seasonal_adjustment REAL DEFAULT 0, -- Ajuste sazonal
    urgency_premium REAL DEFAULT 0, -- Premium por urgência
    
    -- Configurações de Surge Pricing
    demand_threshold INTEGER DEFAULT 10, -- Número de clientes para ativar surge
    max_surge_multiplier REAL DEFAULT 2.0,
    
    -- Validade
    effective_from TEXT DEFAULT (datetime('now')),
    effective_until TEXT,
    is_active INTEGER DEFAULT 1,
    
    created_at TEXT DEFAULT (datetime('now'))
);

-- Template de Notificações Personalizadas
CREATE TABLE IF NOT EXISTS vaga_express_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_name TEXT UNIQUE NOT NULL,
    plan TEXT, -- BASIC, PREMIUM, VIP, ou NULL para todos
    channel TEXT NOT NULL, -- whatsapp, email, sms
    urgency_level TEXT, -- LOW, MEDIUM, HIGH, URGENT
    
    -- Conteúdo do Template
    subject TEXT, -- Para emails
    message_template TEXT NOT NULL, -- Com placeholders {{clientName}}, etc
    
    -- Configurações
    is_active INTEGER DEFAULT 1,
    priority_order INTEGER DEFAULT 1,
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- ==================================================
-- ATUALIZAÇÃO DA TABELA APPOINTMENT_WAITLIST
-- ==================================================

-- Adicionar colunas para Vaga Express na waitlist existente
ALTER TABLE appointment_waitlist ADD COLUMN vaga_express_subscription TEXT;
ALTER TABLE appointment_waitlist ADD COLUMN plan_type TEXT; -- BASIC, PREMIUM, VIP
ALTER TABLE appointment_waitlist ADD COLUMN payment_amount REAL;

-- ==================================================
-- ÍNDICES PARA PERFORMANCE
-- ==================================================

-- Índices para Vaga Express
CREATE INDEX IF NOT EXISTS idx_vaga_express_client ON vaga_express_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_vaga_express_status ON vaga_express_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_vaga_express_expiry ON vaga_express_subscriptions(expiry_date);
CREATE INDEX IF NOT EXISTS idx_vaga_express_country ON vaga_express_subscriptions(country, consulate);

CREATE INDEX IF NOT EXISTS idx_vip_consultancy_scheduled ON vip_consultancy_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_vip_consultancy_status ON vip_consultancy_queue(status);

CREATE INDEX IF NOT EXISTS idx_slot_history_subscription ON vaga_express_slot_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_slot_history_date ON vaga_express_slot_history(slot_date);

CREATE INDEX IF NOT EXISTS idx_metrics_date ON vaga_express_metrics(date);
CREATE INDEX IF NOT EXISTS idx_pricing_plan_country ON vaga_express_pricing(plan, country);

-- ==================================================
-- TRIGGERS PARA AUTOMAÇÃO
-- ==================================================

-- Trigger para atualizar métricas quando há venda
CREATE TRIGGER IF NOT EXISTS update_metrics_on_sale
    AFTER INSERT ON vaga_express_subscriptions
    WHEN NEW.payment_status = 'COMPLETED'
    BEGIN
        INSERT OR IGNORE INTO vaga_express_metrics (date) VALUES (date('now'));
        
        UPDATE vaga_express_metrics 
        SET 
            basic_sales = basic_sales + CASE WHEN NEW.plan = 'BASIC' THEN 1 ELSE 0 END,
            premium_sales = premium_sales + CASE WHEN NEW.plan = 'PREMIUM' THEN 1 ELSE 0 END,
            vip_sales = vip_sales + CASE WHEN NEW.plan = 'VIP' THEN 1 ELSE 0 END,
            total_revenue = total_revenue + NEW.amount
        WHERE date = date('now');
    END;

-- Trigger para atualizar métricas quando vaga é encontrada
CREATE TRIGGER IF NOT EXISTS update_metrics_on_slot_found
    AFTER INSERT ON vaga_express_slot_history
    BEGIN
        INSERT OR IGNORE INTO vaga_express_metrics (date) VALUES (date('now'));
        
        UPDATE vaga_express_metrics 
        SET 
            slots_detected = slots_detected + 1,
            notifications_sent = notifications_sent + 1
        WHERE date = date('now');
    END;

-- Trigger para atualizar métricas quando booking é bem-sucedido
CREATE TRIGGER IF NOT EXISTS update_metrics_on_successful_booking
    AFTER UPDATE ON vaga_express_slot_history
    WHEN NEW.booking_successful = 1 AND OLD.booking_successful = 0
    BEGIN
        UPDATE vaga_express_metrics 
        SET 
            successful_bookings = successful_bookings + 1
        WHERE date = date('now');
        
        -- Marcar subscription como FULFILLED
        UPDATE vaga_express_subscriptions 
        SET 
            status = 'FULFILLED',
            success_date = datetime('now'),
            updated_at = datetime('now')
        WHERE id = NEW.subscription_id;
    END;

-- Trigger para atualizar timestamp updated_at
CREATE TRIGGER IF NOT EXISTS update_vaga_express_timestamp 
    AFTER UPDATE ON vaga_express_subscriptions
    BEGIN
        UPDATE vaga_express_subscriptions 
        SET updated_at = datetime('now') 
        WHERE id = NEW.id;
    END;

-- ==================================================
-- DADOS INICIAIS
-- ==================================================

-- Templates de Notificação Padrão
INSERT OR IGNORE INTO vaga_express_templates (template_name, plan, channel, urgency_level, subject, message_template) VALUES
('basic_slot_found', 'BASIC', 'whatsapp', 'MEDIUM', NULL, '🥉 *VAGA DETECTADA - BASIC*\n\nOlá {{clientName}}!\n\n📅 Nova vaga: {{slotDate}} às {{slotTime}}\n🏛️ {{consulate}} - {{country}}\n\n⏰ Você tem {{maxNoticeHours}}h para decidir\n📞 Responda "SIM" para confirmar!'),

('premium_slot_found', 'PREMIUM', 'whatsapp', 'HIGH', NULL, '🥈 *VAGA PREMIUM DETECTADA*\n\nOlá {{clientName}}!\n\n🚨 OPORTUNIDADE PREMIUM!\n📅 Vaga: {{slotDate}} às {{slotTime}}\n🏛️ {{consulate}} - {{country}}\n⏰ {{advanceDays}} dias de antecedência!\n\n💰 Com garantia de reembolso\n📞 Responda "CONFIRMAR" para agendar!'),

('vip_slot_found', 'VIP', 'whatsapp', 'URGENT', NULL, '🥇 *ALERTA VIP - VAGA EXCLUSIVA*\n\n👑 {{clientName}}, oportunidade VIP!\n\n🚨 VAGA DISPONÍVEL:\n📅 {{slotDate}} às {{slotTime}}\n🏛️ {{consulate}} - {{country}}\n⚡ {{advanceDays}} dias de antecedência!\n\n👨‍💼 Suporte dedicado ativo\n📞 RESPOSTA IMEDIATA: "VIP"\n\nSeu consultor pessoal irá ajudar!'),

('basic_welcome', 'BASIC', 'email', 'MEDIUM', '🥉 Bem-vindo ao Vaga Express Basic', 'Seu monitoramento foi ativado com sucesso!'),

('premium_welcome', 'PREMIUM', 'email', 'HIGH', '🥈 Bem-vindo ao Vaga Express Premium', 'Monitoramento premium ativado com garantia!'),

('vip_welcome', 'VIP', 'email', 'URGENT', '🥇 Bem-vindo ao Vaga Express VIP', 'Serviço VIP ativado - Suporte dedicado disponível!');

-- Configurações de Preço Inicial
INSERT OR IGNORE INTO vaga_express_pricing (plan, country, base_price, effective_from) VALUES
('BASIC', 'USA', 297.00, datetime('now')),
('PREMIUM', 'USA', 497.00, datetime('now')),
('VIP', 'USA', 797.00, datetime('now')),
('BASIC', 'CANADA', 247.00, datetime('now')),
('PREMIUM', 'CANADA', 397.00, datetime('now')),
('VIP', 'CANADA', 647.00, datetime('now')),
('BASIC', 'ANY', 297.00, datetime('now')),
('PREMIUM', 'ANY', 497.00, datetime('now')),
('VIP', 'ANY', 797.00, datetime('now'));

-- Métrica inicial
INSERT OR IGNORE INTO vaga_express_metrics (date) VALUES (date('now'));