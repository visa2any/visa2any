// Database Setup Script for Visa2Any
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🗄️ Iniciando setup do banco de dados SQLite...\n');

// Paths
const databaseDir = path.join(__dirname, '../database');
const schemaFile = path.join(databaseDir, 'sqlite_schema.sql');
const vagaExpressFile = path.join(databaseDir, 'vaga_express_tables.sql');
const dbFile = path.join(databaseDir, 'visa2any.db');

try {
    // Check if sqlite3 is available
    try {
        execSync('which sqlite3', { stdio: 'ignore' });
        console.log('✅ SQLite3 encontrado no sistema');
    } catch (error) {
        console.log('⚠️ SQLite3 não encontrado. Tentando instalar...');
        
        try {
            // Try to install sqlite3 on Ubuntu/Debian
            execSync('sudo apt-get update && sudo apt-get install -y sqlite3', { stdio: 'inherit' });
            console.log('✅ SQLite3 instalado com sucesso');
        } catch (installError) {
            console.error('❌ Não foi possível instalar SQLite3 automaticamente.');
            console.log('Por favor, instale manualmente:');
            console.log('Ubuntu/Debian: sudo apt-get install sqlite3');
            console.log('macOS: brew install sqlite3');
            console.log('Windows: Baixe de https://sqlite.org/download.html');
            process.exit(1);
        }
    }

    // Create database directory if it doesn't exist
    if (!fs.existsSync(databaseDir)) {
        fs.mkdirSync(databaseDir, { recursive: true });
        console.log('📁 Diretório de banco de dados criado');
    }

    // Remove existing database for fresh start
    if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
        console.log('🗑️ Banco existente removido para criação limpa');
    }

    // Execute main schema
    if (fs.existsSync(schemaFile)) {
        console.log('📋 Executando schema principal...');
        execSync(`sqlite3 "${dbFile}" < "${schemaFile}"`, { stdio: 'inherit' });
        console.log('✅ Schema principal criado com sucesso');
    } else {
        console.error('❌ Arquivo sqlite_schema.sql não encontrado!');
        process.exit(1);
    }

    // Execute Vaga Express schema
    if (fs.existsSync(vagaExpressFile)) {
        console.log('⚡ Executando schema do Vaga Express...');
        execSync(`sqlite3 "${dbFile}" < "${vagaExpressFile}"`, { stdio: 'inherit' });
        console.log('✅ Schema do Vaga Express criado com sucesso');
    } else {
        console.warn('⚠️ Arquivo vaga_express_tables.sql não encontrado, pulando...');
    }

    // Verify database creation
    console.log('\n🔍 Verificando tabelas criadas...');
    const tables = execSync(`sqlite3 "${dbFile}" ".tables"`, { encoding: 'utf8' });
    console.log('📊 Tabelas encontradas:');
    console.log(tables.trim().split(/\s+/).map(table => `  • ${table}`).join('\n'));

    // Test database with a simple query
    console.log('\n🧪 Testando banco de dados...');
    const version = execSync(`sqlite3 "${dbFile}" "SELECT sqlite_version();"`, { encoding: 'utf8' });
    console.log(`✅ SQLite versão: ${version.trim()}`);

    // Get table count
    const tableCount = execSync(`sqlite3 "${dbFile}" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';"`, { encoding: 'utf8' });
    console.log(`📋 Total de tabelas: ${tableCount.trim()}`);

    console.log('\n🎉 BANCO DE DADOS CONFIGURADO COM SUCESSO!');
    console.log(`📍 Localização: ${dbFile}`);
    console.log('\n📝 Próximos passos:');
    console.log('1. npm run whatsapp (para iniciar WhatsApp Baileys)');
    console.log('2. Importar workflows no N8N');
    console.log('3. Configurar variáveis de ambiente');

} catch (error) {
    console.error('\n❌ ERRO no setup do banco de dados:');
    console.error(error.message);
    console.log('\n🔧 Soluções possíveis:');
    console.log('• Verificar se SQLite3 está instalado');
    console.log('• Conferir permissões de arquivo');
    console.log('• Executar como administrador se necessário');
    process.exit(1);
}