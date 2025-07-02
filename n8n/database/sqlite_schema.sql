-- VISA2ANY N8N DATABASE SCHEMA - SQLITE
-- Execute este arquivo para criar todas as tabelas necessárias

-- ==================================================
-- TABELAS CORE DO SISTEMA
-- ==================================================

-- Clientes
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    cpf TEXT,
    target_country TEXT,
    visa_type TEXT,
    status TEXT DEFAULT 'ACTIVE',
    total_paid REAL DEFAULT 0,
    payment_status TEXT DEFAULT 'PENDING',
    last_payment_at TEXT,
    payment_method TEXT,
    service_price REAL,
    payment_sequence INTEGER DEFAULT 1,
    assigned_consultant INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Consultores
CREATE TABLE IF NOT EXISTS consultants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'JUNIOR', -- JUNIOR, MID_LEVEL, SENIOR
    status TEXT DEFAULT 'ACTIVE',
    specialties TEXT, -- JSON array of countries
    performance_score REAL DEFAULT 0,
    availability INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Pagamentos
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    payment_id TEXT UNIQUE,
    amount REAL,
    currency TEXT DEFAULT 'BRL',
    method TEXT,
    status TEXT,
    installments INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Preferências dos clientes
CREATE TABLE IF NOT EXISTS client_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    communication_preferences TEXT, -- JSON
    best_contact_time TEXT,
    preferred_city TEXT,
    family_members INTEGER DEFAULT 0,
    has_dependents INTEGER DEFAULT 0,
    plans_to_immigrate INTEGER DEFAULT 0,
    interested_in_citizenship INTEGER DEFAULT 0,
    budget_range TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ==================================================
-- AUTOMAÇÃO E WORKFLOWS
-- ==================================================

-- Intervenções Proativas
CREATE TABLE IF NOT EXISTS proactive_interventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    intervention_type TEXT,
    priority TEXT,
    recommended_action TEXT,
    message TEXT,
    intervention_plan TEXT, -- JSON
    detected_at TEXT,
    status TEXT DEFAULT 'PENDING',
    executed_at TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Campanhas de Upsell
CREATE TABLE IF NOT EXISTS upsell_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    campaign_id TEXT UNIQUE,
    visa_approved_date TEXT,
    opportunities TEXT, -- JSON
    total_value REAL,
    campaign_data TEXT, -- JSON
    status TEXT DEFAULT 'ACTIVE',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Leads Enriquecidos
CREATE TABLE IF NOT EXISTS enriched_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id TEXT UNIQUE,
    name TEXT,
    email TEXT,
    phone TEXT,
    cpf TEXT,
    target_country TEXT,
    visa_type TEXT,
    budget TEXT,
    urgency TEXT,
    source TEXT,
    credit_score INTEGER,
    social_profile TEXT, -- JSON
    enriched_score INTEGER,
    lead_quality TEXT,
    assigned_consultant INTEGER,
    nurture_sequence TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (assigned_consultant) REFERENCES consultants(id)
);

-- Sequências de Orquestração
CREATE TABLE IF NOT EXISTS orchestration_sequences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orchestration_id TEXT UNIQUE,
    client_id INTEGER,
    trigger_type TEXT,
    strategy_data TEXT, -- JSON
    total_steps INTEGER,
    total_duration INTEGER,
    status TEXT DEFAULT 'PENDING',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Passos da Orquestração
CREATE TABLE IF NOT EXISTS orchestration_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orchestration_id TEXT,
    client_id INTEGER,
    step_index INTEGER,
    channel TEXT,
    type TEXT,
    priority TEXT,
    scheduled_for TEXT,
    delay_hours INTEGER,
    status TEXT DEFAULT 'SCHEDULED',
    context_data TEXT, -- JSON
    executed_at TEXT,
    message_content TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Eventos de Pagamento
CREATE TABLE IF NOT EXISTS payment_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    payment_id TEXT,
    event_type TEXT,
    amount REAL,
    currency TEXT,
    method TEXT,
    status TEXT,
    failure_reason TEXT,
    transaction_data TEXT, -- JSON
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Follow-ups Agendados
CREATE TABLE IF NOT EXISTS scheduled_follow_ups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    campaign_id TEXT,
    sequence_step INTEGER,
    type TEXT,
    scheduled_for TEXT,
    content TEXT,
    subject TEXT,
    cta TEXT,
    priority TEXT,
    status TEXT DEFAULT 'SCHEDULED',
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ==================================================
-- COMUNICAÇÃO E HISTÓRICO
-- ==================================================

-- Histórico de Comunicações
CREATE TABLE IF NOT EXISTS client_communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    channel TEXT, -- whatsapp, email, sms, phone
    type TEXT,
    message_content TEXT,
    response_received INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ==================================================
-- CACHE E PERFORMANCE
-- ==================================================

-- Cache de Vagas Consulares
CREATE TABLE IF NOT EXISTS consular_slots_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT,
    consulate TEXT,
    city TEXT,
    slot_data TEXT, -- JSON
    total_slots INTEGER,
    earliest_date DATE,
    last_checked TEXT DEFAULT (datetime('now'))
);

-- Cache de Validação de Documentos
CREATE TABLE IF NOT EXISTS document_validation_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT,
    file_hash TEXT UNIQUE,
    ocr_text TEXT,
    validation_result TEXT, -- JSON
    confidence_score REAL,
    processing_time_ms INTEGER,
    validated_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT
);

-- Cache de Conteúdo Legal
CREATE TABLE IF NOT EXISTS legal_content_hashes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE,
    country TEXT,
    content_hash TEXT,
    last_checked TEXT DEFAULT (datetime('now')),
    content_preview TEXT
);

-- Log de Mudanças Legais
CREATE TABLE IF NOT EXISTS legal_changes_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT,
    change_type TEXT,
    priority TEXT,
    description TEXT,
    source_url TEXT,
    affected_visa_types TEXT, -- JSON
    detected_at TEXT DEFAULT (datetime('now')),
    content_hash TEXT
);

-- ==================================================
-- DASHBOARD E RELATÓRIOS
-- ==================================================

-- Snapshots do Dashboard
CREATE TABLE IF NOT EXISTS dashboard_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT, -- JSON
    generated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(date(generated_at))
);

-- Estatísticas de Consultores
CREATE TABLE IF NOT EXISTS consultant_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consultant_id INTEGER,
    availability INTEGER DEFAULT 1,
    specialties TEXT, -- JSON
    performance_score REAL DEFAULT 0,
    leads_assigned INTEGER DEFAULT 0,
    clients_converted INTEGER DEFAULT 0,
    last_updated TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (consultant_id) REFERENCES consultants(id)
);

-- ==================================================
-- MONITORAMENTO DE CANCELAMENTOS (NOVO)
-- ==================================================

-- Monitoramento de Cancelamentos/Reagendamentos
CREATE TABLE IF NOT EXISTS appointment_monitoring (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT,
    consulate TEXT,
    city TEXT,
    visa_type TEXT,
    original_date TEXT,
    new_date TEXT,
    change_type TEXT, -- CANCELLATION, RESCHEDULE, NEW_SLOT
    detected_at TEXT DEFAULT (datetime('now')),
    notified_clients TEXT, -- JSON array of client IDs
    availability_window TEXT -- JSON with time ranges
);

-- Clientes Interessados em Adiantar
CREATE TABLE IF NOT EXISTS appointment_waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    country TEXT,
    consulate TEXT,
    visa_type TEXT,
    current_appointment_date TEXT,
    preferred_date_range_start TEXT,
    preferred_date_range_end TEXT,
    priority INTEGER DEFAULT 1, -- 1=LOW, 2=MEDIUM, 3=HIGH, 4=URGENT
    notification_methods TEXT, -- JSON: ["whatsapp", "email", "sms"]
    max_notice_hours INTEGER DEFAULT 24, -- Minimum hours notice needed
    created_at TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, FULFILLED
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ==================================================
-- ÍNDICES PARA PERFORMANCE
-- ==================================================

-- Índices principais
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_interventions_client_id ON proactive_interventions(client_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON proactive_interventions(status);
CREATE INDEX IF NOT EXISTS idx_leads_quality ON enriched_leads(lead_quality);
CREATE INDEX IF NOT EXISTS idx_leads_consultant ON enriched_leads(assigned_consultant);
CREATE INDEX IF NOT EXISTS idx_orchestration_client ON orchestration_steps(client_id);
CREATE INDEX IF NOT EXISTS idx_orchestration_scheduled ON orchestration_steps(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_communications_client ON client_communications(client_id);
CREATE INDEX IF NOT EXISTS idx_communications_channel ON client_communications(channel);
CREATE INDEX IF NOT EXISTS idx_slots_country ON consular_slots_cache(country);
CREATE INDEX IF NOT EXISTS idx_legal_country ON legal_content_hashes(country);
CREATE INDEX IF NOT EXISTS idx_waitlist_country ON appointment_waitlist(country, consulate);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON appointment_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_monitoring_country ON appointment_monitoring(country, consulate);

-- ==================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- ==================================================

-- Trigger para atualizar updated_at em clients
CREATE TRIGGER IF NOT EXISTS update_clients_timestamp 
    AFTER UPDATE ON clients
    BEGIN
        UPDATE clients SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

-- Trigger para atualizar stats de consultores
CREATE TRIGGER IF NOT EXISTS update_consultant_stats_on_lead
    AFTER INSERT ON enriched_leads
    WHEN NEW.assigned_consultant IS NOT NULL
    BEGIN
        UPDATE consultant_stats 
        SET leads_assigned = leads_assigned + 1,
            last_updated = datetime('now')
        WHERE consultant_id = NEW.assigned_consultant;
    END;

-- ==================================================
-- DADOS INICIAIS (OPCIONAL)
-- ==================================================

-- Inserir consultores exemplo
INSERT OR IGNORE INTO consultants (name, email, type, specialties) VALUES
('Ana Silva', 'ana@visa2any.com', 'SENIOR', '["USA", "CANADA"]'),
('Carlos Santos', 'carlos@visa2any.com', 'MID_LEVEL', '["AUSTRALIA", "UK"]'),
('Maria Oliveira', 'maria@visa2any.com', 'JUNIOR', '["PORTUGAL", "SPAIN"]');

-- Inserir stats iniciais para consultores
INSERT OR IGNORE INTO consultant_stats (consultant_id, performance_score) 
SELECT id, 75.0 FROM consultants;