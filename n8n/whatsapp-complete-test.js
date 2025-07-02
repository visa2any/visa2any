// Teste completo da implementação WhatsApp
console.log('🧪 INICIANDO TESTE COMPLETO DO WHATSAPP\n');

// 1. Teste da API principal
async function testMainAPI() {
    console.log('1️⃣ Testando API principal do WhatsApp...');
    
    try {
        const response = await fetch('http://localhost:3001/whatsapp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: '5511987654321',
                message: '✅ Teste da API principal: Funcionando perfeitamente!',
                clientId: 'test-001',
                campaign: 'api_test'
            })
        });
        
        const result = await response.json();
        console.log('   ✅ Resultado:', result);
        return result.success;
    } catch (error) {
        console.log('   ❌ Erro:', error.message);
        return false;
    }
}

// 2. Teste do Health Check
async function testHealthCheck() {
    console.log('\n2️⃣ Testando Health Check...');
    
    try {
        const response = await fetch('http://localhost:3001/health');
        const result = await response.json();
        console.log('   ✅ Status do serviço:', result);
        return result.status === 'running';
    } catch (error) {
        console.log('   ❌ Erro:', error.message);
        return false;
    }
}

// 3. Teste de múltiplas mensagens
async function testBulkMessages() {
    console.log('\n3️⃣ Testando envio em lote...');
    
    const messages = [
        {
            phone: '5511987654321',
            message: '🎉 Mensagem 1: Boas-vindas!',
            clientId: 'test-002'
        },
        {
            phone: '5511987654321', 
            message: '📊 Mensagem 2: Análise pronta!',
            clientId: 'test-003'
        },
        {
            phone: '5511987654321',
            message: '📅 Mensagem 3: Lembrete de consultoria!',
            clientId: 'test-004'
        }
    ];
    
    let successCount = 0;
    
    for (const msg of messages) {
        try {
            const response = await fetch('http://localhost:3001/whatsapp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(msg)
            });
            
            const result = await response.json();
            if (result.success) {
                successCount++;
                console.log(`   ✅ Mensagem ${successCount} enviada`);
            } else {
                console.log(`   ❌ Falha na mensagem ${successCount + 1}`);
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.log(`   ❌ Erro na mensagem ${successCount + 1}:`, error.message);
        }
    }
    
    console.log(`   📊 Resumo: ${successCount}/${messages.length} mensagens enviadas`);
    return successCount === messages.length;
}

// 4. Teste de templates 
async function testTemplates() {
    console.log('\n4️⃣ Testando templates de mensagem...');
    
    const templates = [
        {
            name: 'Boas-vindas',
            message: '🌎 Olá! Bem-vindo(a) à Visa2Any!\n\nEstamos muito animados para ajudá-lo(a) a realizar seu sonho internacional! 🎉'
        },
        {
            name: 'Análise pronta',
            message: '🎉 Ótimas notícias!\n\nSua análise de elegibilidade está pronta! 📊\n\n✅ Score: 85/100\n✅ Visto recomendado: Turismo'
        },
        {
            name: 'Follow-up',
            message: '👋 Como está seu processo?\n\n📊 Status atual: Em andamento\n📅 Última atividade: Hoje\n\nPrecisa de ajuda? 😊'
        }
    ];
    
    let successCount = 0;
    
    for (const template of templates) {
        try {
            const response = await fetch('http://localhost:3001/whatsapp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: '5511987654321',
                    message: template.message,
                    clientId: `template-test-${Date.now()}`,
                    campaign: template.name.toLowerCase().replace(' ', '_')
                })
            });
            
            const result = await response.json();
            if (result.success) {
                successCount++;
                console.log(`   ✅ Template "${template.name}" enviado`);
            } else {
                console.log(`   ❌ Falha no template "${template.name}"`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
        } catch (error) {
            console.log(`   ❌ Erro no template "${template.name}":`, error.message);
        }
    }
    
    console.log(`   📊 Templates: ${successCount}/${templates.length} enviados`);
    return successCount === templates.length;
}

// 5. Relatório final
async function generateReport(results) {
    console.log('\n📋 RELATÓRIO FINAL DO TESTE WHATSAPP');
    console.log('=====================================');
    
    const testResults = [
        { name: 'API Principal', status: results.mainAPI },
        { name: 'Health Check', status: results.health },
        { name: 'Envio em Lote', status: results.bulk },
        { name: 'Templates', status: results.templates }
    ];
    
    testResults.forEach(test => {
        const icon = test.status ? '✅' : '❌';
        const status = test.status ? 'PASSOU' : 'FALHOU';
        console.log(`${icon} ${test.name}: ${status}`);
    });
    
    const totalPassed = testResults.filter(t => t.status).length;
    const totalTests = testResults.length;
    const percentage = ((totalPassed / totalTests) * 100).toFixed(1);
    
    console.log(`\n📊 Resultado geral: ${totalPassed}/${totalTests} (${percentage}%)`);
    
    if (percentage >= 75) {
        console.log('🎉 IMPLEMENTAÇÃO DO WHATSAPP: APROVADA!');
        console.log('✅ O sistema está pronto para produção');
    } else {
        console.log('⚠️  IMPLEMENTAÇÃO DO WHATSAPP: PRECISA DE AJUSTES');
        console.log('❌ Alguns testes falharam, revisar implementação');
    }
    
    console.log('\n🔧 Próximos passos para produção:');
    console.log('1. Conectar WhatsApp real (escanear QR Code)');
    console.log('2. Configurar números reais nos links');
    console.log('3. Integrar com N8N workflows');
    console.log('4. Configurar monitoramento');
}

// Executar todos os testes
async function runAllTests() {
    const results = {
        mainAPI: await testMainAPI(),
        health: await testHealthCheck(),
        bulk: await testBulkMessages(),
        templates: await testTemplates()
    };
    
    await generateReport(results);
}

// Verificar se tem fetch (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.log('❌ Este teste requer Node.js 18+ com fetch nativo');
    console.log('💡 Ou instale node-fetch: npm install node-fetch');
    process.exit(1);
}

runAllTests().catch(console.error);