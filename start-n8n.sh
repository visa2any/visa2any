#!/bin/bash

echo "🚀 Iniciando N8N para Visa2Any..."
echo ""
echo "📋 Configurando variáveis de ambiente..."

export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=visa2any123!
export N8N_HOST=0.0.0.0
export N8N_PORT=5678
export N8N_PROTOCOL=http
export WEBHOOK_URL=http://localhost:5678
export GENERIC_TIMEZONE=America/Sao_Paulo
export N8N_LOG_LEVEL=info
export EXECUTIONS_DATA_SAVE_ON_ERROR=all
export EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
export N8N_USER_FOLDER="$(pwd)/n8n-data"

echo "📁 Criando diretório de dados..."
mkdir -p n8n-data

echo ""
echo "========================================"
echo "  🤖 N8N Visa2Any Automation Platform"  
echo "========================================"
echo "  🌐 URL: http://localhost:5678"
echo "  👤 Usuário: admin"
echo "  🔑 Senha: visa2any123!"
echo "========================================"
echo ""
echo "⚡ Iniciando N8N..."

npx n8n start