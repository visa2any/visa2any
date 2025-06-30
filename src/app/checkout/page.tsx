'use client'

import { useState, useEffect, Suspense } from 'react'
import AffiliateBanner from '@/components/AffiliateBanner'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CreditCard, Shield, Check, Clock, Star, Plus, Minus, Users, User, Baby, Tag, Gift, Percent, FileText, X } from 'lucide-react'
import Link from 'next/link'
import CheckoutUpsells from '@/components/CheckoutUpsells'
import Breadcrumb from '@/components/Breadcrumb'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Definir produtos disponíveis
const PRODUCTS = {
  // EUA - B1/B2 Turismo/Negócios (REMOVIDO - duplicata)
  
  // EUA - F1 Estudante (REMOVIDO - duplicata)
  
  // EUA - H1B Trabalho (REMOVIDO - duplicata)
  
  // EUA - O1 Habilidade Extraordinária (REMOVIDO - duplicata)
  
  // Canadá - Turismo (REMOVIDO - duplicata)
  
  // Canadá - Estudo (REMOVIDO - duplicata)
  
  // Canadá - Trabalho (REMOVIDO - duplicata)
  
  // Austrália - Turismo (REMOVIDO - duplicata)
  
  // Austrália - Estudante (REMOVIDO - duplicata)
  
  // Tier 3 - Europa (REMOVIDO - duplicata)
  
  // Reino Unido (REMOVIDO - duplicata)
  
  // Ásia (China, Japão, etc.)
  'asia-turismo-pre-analise': { name: 'Pré-Análise Ásia', price: 0, description: 'Análise gratuita Ásia' },
  'asia-turismo-relatorio': { name: 'Relatório Ásia', price: 127, description: 'Assessoria Ásia' },
  'asia-turismo-consultoria': { name: 'Consultoria Ásia', price: 347, description: 'Especialista Ásia' },
  'asia-turismo-vip': { name: 'VIP Ásia', price: 1797, description: 'Serviço completo Ásia' },
  
  // Serviços Especiais Originais
  'passaporte-urgente': { name: 'Passaporte Urgente', price: 127, description: 'Assessoria PF + Emergência' },
  'seguro-viagem': { name: 'Seguro Viagem', price: 67, description: 'Europa/Schengen + Assessoria' },
  'cidadania-dupla': { name: 'Cidadania Dupla', price: 497, description: 'Portuguesa/Italiana/Espanhola' },
  'mercosul-express': { name: 'Mercosul Express', price: 47, description: 'Países sem visto + Apoio' },
  
  // PRODUTOS ESSENCIAIS - Documentação
  'apostila-haia-simples': { name: 'Apostila de Haia Simples', price: 147, description: 'Legalização de 1 documento' },
  'apostila-haia-express': { name: 'Apostila de Haia Express', price: 197, description: 'Legalização urgente em 24h' },
  'apostila-haia-multipla': { name: 'Apostila de Haia Múltipla', price: 297, description: 'Legalização de 3+ documentos' },
  
  'traducao-simples': { name: 'Tradução Juramentada Simples', price: 67, description: 'Até 1 página' },
  'traducao-multipla': { name: 'Tradução Juramentada Múltipla', price: 197, description: 'Até 5 páginas' },
  'traducao-express': { name: 'Tradução Express 24h', price: 297, description: 'Tradução urgente em 24h' },
  
  'antecedentes-criminais': { name: 'Antecedentes Criminais', price: 97, description: 'PF + Estadual + apostila' },
  'antecedentes-express': { name: 'Antecedentes Express', price: 247, description: 'Processamento prioritário' },
  
  // PRODUTOS ESSENCIAIS - Serviços Consulares
  'agendamento-usa': { name: 'Agendamento Consular EUA', price: 497, description: 'Agendamento prioritário + preparação' },
  'agendamento-canada': { name: 'Agendamento Consular Canadá', price: 397, description: 'Biometria + VAC appointment' },
  'agendamento-uk': { name: 'Agendamento Reino Unido', price: 447, description: 'VFS Premium + prioridade' },
  'agendamento-australia': { name: 'Agendamento Austrália', price: 497, description: 'Appointment + health examination' },
  
  'entrevista-usa': { name: 'Preparação Entrevista EUA', price: 397, description: 'Coaching + simulação consular' },
  'entrevista-uk': { name: 'Preparação Entrevista UK', price: 347, description: 'Treinamento específico Reino Unido' },
  'entrevista-vip': { name: 'Preparação VIP Premium', price: 797, description: 'Ex-consul + 3 sessões + material' },
  
  // PRODUTOS DE CONVENIÊNCIA
  'kit-documentacao-basic': { name: 'Kit Documentação Básico', price: 97, description: 'Checklist + templates' },
  'kit-documentacao-premium': { name: 'Kit Documentação Premium', price: 147, description: 'Checklist + templates + alertas' },
  'kit-documentacao-vip': { name: 'Kit Documentação VIP', price: 197, description: 'Kit Premium + consultoria' },
  
  'biometria-vfs-uk': { name: 'Biometria VFS Reino Unido', price: 297, description: 'Agendamento prioritário VFS' },
  'biometria-vfs-canada': { name: 'Biometria VFS Canadá', price: 247, description: 'VAC premium service' },
  'biometria-australia': { name: 'Biometria Austrália', price: 347, description: 'Health examination + biometrics' },
  
  'curso-imigracao-usa': { name: 'Curso Imigração EUA', price: 197, description: 'Video-aulas + quizzes + certificado' },
  'curso-imigracao-canada': { name: 'Curso Imigração Canadá', price: 247, description: 'Express Entry + PNP completo' },
  'curso-imigracao-europa': { name: 'Curso Imigração Europa', price: 197, description: 'Portugal, Espanha, Alemanha' },
  'curso-imigracao-vip': { name: 'Curso VIP Todos Países', price: 497, description: 'Acesso completo + mentoria' },
  
  // PRODUTOS FINANCEIROS
  'cambio-vip-pequeno': { name: 'Câmbio VIP até $10k', price: 297, description: 'Taxa preferencial + assessoria' },
  'cambio-vip-medio': { name: 'Câmbio VIP até $50k', price: 497, description: 'Taxa VIP + acompanhamento' },
  'cambio-vip-alto': { name: 'Câmbio VIP +$50k', price: 997, description: 'Taxa premium + gerente dedicado' },
  
  'seguro-negacao-basic': { name: 'Seguro Negação Básico', price: 197, description: 'Cobertura até R$ 5.000' },
  'seguro-negacao-premium': { name: 'Seguro Negação Premium', price: 347, description: 'Cobertura até R$ 15.000' },
  'seguro-negacao-vip': { name: 'Seguro Negação VIP', price: 497, description: 'Cobertura até R$ 30.000' },
  
  'golden-visa-portugal': { name: 'Golden Visa Portugal', price: 5000, description: 'Consultoria completa investimento' },
  'golden-visa-espanha': { name: 'Golden Visa Espanha', price: 4500, description: 'Investimento EUR 500k+' },
  'start-up-visa-canada': { name: 'Start-up Visa Canadá', price: 7500, description: 'Programa empreendedor completo' },
  
  // PRODUTOS POR PAÍS ESPECÍFICO
  'esta-renovacao': { name: 'ESTA Renovação Automática', price: 97, description: 'Renovação + monitoramento' },
  'renovacao-visto-usa': { name: 'Renovação Visto EUA', price: 397, description: 'Renovação sem entrevista' },
  'social-security-usa': { name: 'Social Security EUA', price: 297, description: 'Consultoria SSN + ITIN' },
  
  'express-entry-optimization': { name: 'Express Entry Otimização', price: 1497, description: 'CRS score maximization' },
  'pnp-consultoria': { name: 'PNP Consultoria Completa', price: 2497, description: 'Provincial Nominee Program' },
  'credential-assessment': { name: 'Credential Assessment', price: 497, description: 'Reconhecimento de diploma Canadá' },
  
  'niss-utente-portugal': { name: 'NISS + Utente Portugal', price: 297, description: 'Segurança social + saúde' },
  'reconhecimento-diploma-pt': { name: 'Reconhecimento Diploma PT', price: 897, description: 'Validação académica completa' },
  'visto-cplp': { name: 'Visto CPLP Especializado', price: 697, description: 'Assessoria comunidade lusófona' },
  
  'settled-status-uk': { name: 'Settled Status Reino Unido', price: 797, description: 'EU Settlement Scheme' },
  'nhs-registration': { name: 'NHS Registration', price: 197, description: 'Registo sistema saúde UK' },
  'brp-collection': { name: 'BRP Collection Service', price: 297, description: 'Serviço coleta cartão residência' },
  
  // RELOCAÇÃO E MUDANÇA
  'relocacao-express-pequena': { name: 'Relocação Express Pequena', price: 2997, description: 'Até 3m³ + seguro' },
  'relocacao-express-media': { name: 'Relocação Express Média', price: 6997, description: 'Até 10m³ + desembaraço' },
  'relocacao-express-grande': { name: 'Relocação Express Grande', price: 12997, description: 'Container 20ft completo' },
  
  'pet-relocacao-domestico': { name: 'Pet Relocação Doméstico', price: 1997, description: 'Cão/gato nacional' },
  'pet-relocacao-internacional': { name: 'Pet Relocação Internacional', price: 4997, description: 'Transporte + quarentena' },
  'pet-relocacao-vip': { name: 'Pet Relocação VIP', price: 8997, description: 'Múltiplos pets + acompanhamento' },
  
  // Produtos Genéricos do Novo Sistema
  'pre-analise': { name: 'Análise Gratuita', price: 0, description: 'Análise gratuita universal' },
  'relatorio-premium': { name: 'Relatório Premium', price: 97, description: 'Relatório completo' },
  'consultoria-express': { name: 'Consultoria Express', price: 297, description: 'Consultoria 1:1' },
  'assessoria-vip': { name: 'Assessoria VIP', price: 1997, description: 'Serviço VIP completo' },
  
  // EUA - Simplificado
  'usa-turismo-relatorio': { name: 'Relatório EUA Turismo', price: 197, description: 'Relatório para turismo EUA' },
  'usa-turismo-consultoria': { name: 'Consultoria EUA Turismo', price: 497, description: 'Consultoria turismo EUA' },
  'usa-turismo-vip': { name: 'VIP EUA Turismo', price: 2497, description: 'Serviço completo turismo EUA' },
  'usa-estudo-relatorio': { name: 'Relatório EUA Estudo', price: 197, description: 'Relatório para estudo EUA' },
  'usa-estudo-consultoria': { name: 'Consultoria EUA Estudo', price: 497, description: 'Consultoria estudo EUA' },
  'usa-estudo-vip': { name: 'VIP EUA Estudo', price: 2497, description: 'Serviço completo estudo EUA' },
  'usa-trabalho-relatorio': { name: 'Relatório EUA Trabalho', price: 197, description: 'Relatório para trabalho EUA' },
  'usa-trabalho-consultoria': { name: 'Consultoria EUA Trabalho', price: 497, description: 'Consultoria trabalho EUA' },
  'usa-trabalho-vip': { name: 'VIP EUA Trabalho', price: 2497, description: 'Serviço completo trabalho EUA' },
  'usa-investimento-relatorio': { name: 'Relatório EUA Investimento', price: 497, description: 'Relatório para investimento EUA' },
  'usa-investimento-consultoria': { name: 'Consultoria EUA Investimento', price: 1297, description: 'Consultoria investimento EUA' },
  'usa-investimento-vip': { name: 'VIP EUA Investimento', price: 4997, description: 'Serviço completo investimento EUA' },
  'usa-arte-relatorio': { name: 'Relatório EUA Arte', price: 347, description: 'Relatório para arte/cultura EUA' },
  'usa-arte-consultoria': { name: 'Consultoria EUA Arte', price: 697, description: 'Consultoria arte/cultura EUA' },
  'usa-arte-vip': { name: 'VIP EUA Arte', price: 3297, description: 'Serviço completo arte/cultura EUA' },
  'usa-familia-relatorio': { name: 'Relatório EUA Família', price: 227, description: 'Relatório para reunificação familiar EUA' },
  'usa-familia-consultoria': { name: 'Consultoria EUA Família', price: 547, description: 'Consultoria família EUA' },
  'usa-familia-vip': { name: 'VIP EUA Família', price: 2747, description: 'Serviço completo família EUA' },
  'usa-religioso-relatorio': { name: 'Relatório EUA Religioso', price: 217, description: 'Relatório para visto religioso EUA' },
  'usa-religioso-consultoria': { name: 'Consultoria EUA Religioso', price: 497, description: 'Consultoria religioso EUA' },
  'usa-religioso-vip': { name: 'VIP EUA Religioso', price: 2497, description: 'Serviço completo religioso EUA' },
  'usa-aposentadoria-relatorio': { name: 'Relatório EUA Aposentadoria', price: 187, description: 'Relatório para aposentadoria EUA' },
  'usa-aposentadoria-consultoria': { name: 'Consultoria EUA Aposentadoria', price: 447, description: 'Consultoria aposentadoria EUA' },
  'usa-aposentadoria-vip': { name: 'VIP EUA Aposentadoria', price: 2197, description: 'Serviço completo aposentadoria EUA' },
  
  // Canadá - Simplificado,  'canada-turismo-relatorio': { name: 'Relatório Canadá Turismo', price: 147, description: 'Relatório para turismo Canadá' },
  'canada-turismo-consultoria': { name: 'Consultoria Canadá Turismo', price: 397, description: 'Consultoria turismo Canadá' },
  'canada-turismo-vip': { name: 'VIP Canadá Turismo', price: 1997, description: 'Serviço completo turismo Canadá' },
  'canada-estudo-relatorio': { name: 'Relatório Canadá Estudo', price: 147, description: 'Relatório para estudo Canadá' },
  'canada-estudo-consultoria': { name: 'Consultoria Canadá Estudo', price: 397, description: 'Consultoria estudo Canadá' },
  'canada-estudo-vip': { name: 'VIP Canadá Estudo', price: 1997, description: 'Serviço completo estudo Canadá' },
  'canada-trabalho-relatorio': { name: 'Relatório Canadá Trabalho', price: 147, description: 'Relatório para trabalho Canadá' },
  'canada-trabalho-consultoria': { name: 'Consultoria Canadá Trabalho', price: 397, description: 'Consultoria trabalho Canadá' },
  'canada-trabalho-vip': { name: 'VIP Canadá Trabalho', price: 1997, description: 'Serviço completo trabalho Canadá' },
  'canada-investimento-relatorio': { name: 'Relatório Canadá Investimento', price: 297, description: 'Relatório para investimento Canadá' },
  'canada-investimento-consultoria': { name: 'Consultoria Canadá Investimento', price: 797, description: 'Consultoria investimento Canadá' },
  'canada-investimento-vip': { name: 'VIP Canadá Investimento', price: 3497, description: 'Serviço completo investimento Canadá' },
  'canada-arte-relatorio': { name: 'Relatório Canadá Arte', price: 217, description: 'Relatório para arte/cultura Canadá' },
  'canada-arte-consultoria': { name: 'Consultoria Canadá Arte', price: 497, description: 'Consultoria arte/cultura Canadá' },
  'canada-arte-vip': { name: 'VIP Canadá Arte', price: 2397, description: 'Serviço completo arte/cultura Canadá' },
  'canada-familia-relatorio': { name: 'Relatório Canadá Família', price: 167, description: 'Relatório para reunificação familiar Canadá' },
  'canada-familia-consultoria': { name: 'Consultoria Canadá Família', price: 427, description: 'Consultoria família Canadá' },
  'canada-familia-vip': { name: 'VIP Canadá Família', price: 2147, description: 'Serviço completo família Canadá' },
  'canada-religioso-relatorio': { name: 'Relatório Canadá Religioso', price: 157, description: 'Relatório para visto religioso Canadá' },
  'canada-religioso-consultoria': { name: 'Consultoria Canadá Religioso', price: 397, description: 'Consultoria religioso Canadá' },
  'canada-religioso-vip': { name: 'VIP Canadá Religioso', price: 1997, description: 'Serviço completo religioso Canadá' },
  'canada-aposentadoria-relatorio': { name: 'Relatório Canadá Aposentadoria', price: 137, description: 'Relatório para aposentadoria Canadá' },
  'canada-aposentadoria-consultoria': { name: 'Consultoria Canadá Aposentadoria', price: 347, description: 'Consultoria aposentadoria Canadá' },
  'canada-aposentadoria-vip': { name: 'VIP Canadá Aposentadoria', price: 1797, description: 'Serviço completo aposentadoria Canadá' },
  
  // Austrália - Simplificado,  'australia-turismo-relatorio': { name: 'Relatório Austrália Turismo', price: 197, description: 'Relatório para turismo Austrália' },
  'australia-turismo-consultoria': { name: 'Consultoria Austrália Turismo', price: 497, description: 'Consultoria turismo Austrália' },
  'australia-turismo-vip': { name: 'VIP Austrália Turismo', price: 2497, description: 'Serviço completo turismo Austrália' },
  'australia-estudo-relatorio': { name: 'Relatório Austrália Estudo', price: 197, description: 'Relatório para estudo Austrália' },
  'australia-estudo-consultoria': { name: 'Consultoria Austrália Estudo', price: 497, description: 'Consultoria estudo Austrália' },
  'australia-estudo-vip': { name: 'VIP Austrália Estudo', price: 2497, description: 'Serviço completo estudo Austrália' },
  'australia-trabalho-relatorio': { name: 'Relatório Austrália Trabalho', price: 197, description: 'Relatório para trabalho Austrália' },
  'australia-trabalho-consultoria': { name: 'Consultoria Austrália Trabalho', price: 497, description: 'Consultoria trabalho Austrália' },
  'australia-trabalho-vip': { name: 'VIP Austrália Trabalho', price: 2497, description: 'Serviço completo trabalho Austrália' },
  'australia-investimento-relatorio': { name: 'Relatório Austrália Investimento', price: 447, description: 'Relatório para investimento Austrália' },
  'australia-investimento-consultoria': { name: 'Consultoria Austrália Investimento', price: 1197, description: 'Consultoria investimento Austrália' },
  'australia-investimento-vip': { name: 'VIP Austrália Investimento', price: 4497, description: 'Serviço completo investimento Austrália' },
  'australia-arte-relatorio': { name: 'Relatório Austrália Arte', price: 327, description: 'Relatório para arte/cultura Austrália' },
  'australia-arte-consultoria': { name: 'Consultoria Austrália Arte', price: 647, description: 'Consultoria arte/cultura Austrália' },
  'australia-arte-vip': { name: 'VIP Austrália Arte', price: 3097, description: 'Serviço completo arte/cultura Austrália' },
  'australia-familia-relatorio': { name: 'Relatório Austrália Família', price: 217, description: 'Relatório para reunificação familiar Austrália' },
  'australia-familia-consultoria': { name: 'Consultoria Austrália Família', price: 527, description: 'Consultoria família Austrália' },
  'australia-familia-vip': { name: 'VIP Austrália Família', price: 2647, description: 'Serviço completo família Austrália' },
  'australia-religioso-relatorio': { name: 'Relatório Austrália Religioso', price: 207, description: 'Relatório para visto religioso Austrália' },
  'australia-religioso-consultoria': { name: 'Consultoria Austrália Religioso', price: 497, description: 'Consultoria religioso Austrália' },
  'australia-religioso-vip': { name: 'VIP Austrália Religioso', price: 2497, description: 'Serviço completo religioso Austrália' },
  'australia-aposentadoria-relatorio': { name: 'Relatório Austrália Aposentadoria', price: 177, description: 'Relatório para aposentadoria Austrália' },
  'australia-aposentadoria-consultoria': { name: 'Consultoria Austrália Aposentadoria', price: 447, description: 'Consultoria aposentadoria Austrália' },
  'australia-aposentadoria-vip': { name: 'VIP Austrália Aposentadoria', price: 2197, description: 'Serviço completo aposentadoria Austrália' },
  
  // Portugal/Europa - Simplificado,  'europa-turismo-relatorio': { name: 'Relatório Europa Turismo', price: 97, description: 'Relatório para turismo Europa' },
  'europa-turismo-consultoria': { name: 'Consultoria Europa Turismo', price: 297, description: 'Consultoria turismo Europa' },
  'europa-turismo-vip': { name: 'VIP Europa Turismo', price: 1497, description: 'Serviço completo turismo Europa' },
  'europa-estudo-relatorio': { name: 'Relatório Europa Estudo', price: 97, description: 'Relatório para estudo Europa' },
  'europa-estudo-consultoria': { name: 'Consultoria Europa Estudo', price: 297, description: 'Consultoria estudo Europa' },
  'europa-estudo-vip': { name: 'VIP Europa Estudo', price: 1497, description: 'Serviço completo estudo Europa' },
  'europa-trabalho-relatorio': { name: 'Relatório Europa Trabalho', price: 97, description: 'Relatório para trabalho Europa' },
  'europa-trabalho-consultoria': { name: 'Consultoria Europa Trabalho', price: 297, description: 'Consultoria trabalho Europa' },
  'europa-trabalho-vip': { name: 'VIP Europa Trabalho', price: 1497, description: 'Serviço completo trabalho Europa' },
  'europa-investimento-relatorio': { name: 'Relatório Europa Investimento', price: 197, description: 'Relatório para investimento Europa' },
  'europa-investimento-consultoria': { name: 'Consultoria Europa Investimento', price: 597, description: 'Consultoria investimento Europa' },
  'europa-investimento-vip': { name: 'VIP Europa Investimento', price: 2497, description: 'Serviço completo investimento Europa' },
  'europa-arte-relatorio': { name: 'Relatório Europa Arte', price: 147, description: 'Relatório para arte/cultura Europa' },
  'europa-arte-consultoria': { name: 'Consultoria Europa Arte', price: 427, description: 'Consultoria arte/cultura Europa' },
  'europa-arte-vip': { name: 'VIP Europa Arte', price: 1997, description: 'Serviço completo arte/cultura Europa' },
  'europa-familia-relatorio': { name: 'Relatório Europa Família', price: 107, description: 'Relatório para reunificação familiar Europa' },
  'europa-familia-consultoria': { name: 'Consultoria Europa Família', price: 327, description: 'Consultoria família Europa' },
  'europa-familia-vip': { name: 'VIP Europa Família', price: 1597, description: 'Serviço completo família Europa' },
  'europa-religioso-relatorio': { name: 'Relatório Europa Religioso', price: 97, description: 'Relatório para visto religioso Europa' },
  'europa-religioso-consultoria': { name: 'Consultoria Europa Religioso', price: 297, description: 'Consultoria religioso Europa' },
  'europa-religioso-vip': { name: 'VIP Europa Religioso', price: 1497, description: 'Serviço completo religioso Europa' },
  'europa-aposentadoria-relatorio': { name: 'Relatório Europa Aposentadoria', price: 77, description: 'Relatório para aposentadoria Europa' },
  'europa-aposentadoria-consultoria': { name: 'Consultoria Europa Aposentadoria', price: 247, description: 'Consultoria aposentadoria Europa' },
  'europa-aposentadoria-vip': { name: 'VIP Europa Aposentadoria', price: 1197, description: 'Serviço completo aposentadoria Europa' },
  
  // Outros países - Todas as categorias,  'outros-turismo-relatorio': { name: 'Relatório Outros Turismo', price: 127, description: 'Relatório para turismo outros países' },
  'outros-turismo-consultoria': { name: 'Consultoria Outros Turismo', price: 347, description: 'Consultoria turismo outros países' },
  'outros-turismo-vip': { name: 'VIP Outros Turismo', price: 1797, description: 'Serviço completo turismo outros países' },
  'outros-estudo-relatorio': { name: 'Relatório Outros Estudo', price: 147, description: 'Relatório para estudo outros países' },
  'outros-estudo-consultoria': { name: 'Consultoria Outros Estudo', price: 397, description: 'Consultoria estudo outros países' },
  'outros-estudo-vip': { name: 'VIP Outros Estudo', price: 2097, description: 'Serviço completo estudo outros países' },
  'outros-trabalho-relatorio': { name: 'Relatório Outros Trabalho', price: 167, description: 'Relatório para trabalho outros países' },
  'outros-trabalho-consultoria': { name: 'Consultoria Outros Trabalho', price: 447, description: 'Consultoria trabalho outros países' },
  'outros-trabalho-vip': { name: 'VIP Outros Trabalho', price: 2297, description: 'Serviço completo trabalho outros países' },
  'outros-investimento-relatorio': { name: 'Relatório Outros Investimento', price: 247, description: 'Relatório para investimento outros países' },
  'outros-investimento-consultoria': { name: 'Consultoria Outros Investimento', price: 647, description: 'Consultoria investimento outros países' },
  'outros-investimento-vip': { name: 'VIP Outros Investimento', price: 2997, description: 'Serviço completo investimento outros países' },
  'outros-arte-relatorio': { name: 'Relatório Outros Arte', price: 177, description: 'Relatório para arte/cultura outros países' },
  'outros-arte-consultoria': { name: 'Consultoria Outros Arte', price: 447, description: 'Consultoria arte/cultura outros países' },
  'outros-arte-vip': { name: 'VIP Outros Arte', price: 2197, description: 'Serviço completo arte/cultura outros países' },
  'outros-familia-relatorio': { name: 'Relatório Outros Família', price: 137, description: 'Relatório para reunificação familiar outros países' },
  'outros-familia-consultoria': { name: 'Consultoria Outros Família', price: 367, description: 'Consultoria família outros países' },
  'outros-familia-vip': { name: 'VIP Outros Família', price: 1897, description: 'Serviço completo família outros países' },
  'outros-religioso-relatorio': { name: 'Relatório Outros Religioso', price: 127, description: 'Relatório para visto religioso outros países' },
  'outros-religioso-consultoria': { name: 'Consultoria Outros Religioso', price: 347, description: 'Consultoria religioso outros países' },
  'outros-religioso-vip': { name: 'VIP Outros Religioso', price: 1797, description: 'Serviço completo religioso outros países' },
  'outros-aposentadoria-relatorio': { name: 'Relatório Outros Aposentadoria', price: 117, description: 'Relatório para aposentadoria outros países' },
  'outros-aposentadoria-consultoria': { name: 'Consultoria Outros Aposentadoria', price: 317, description: 'Consultoria aposentadoria outros países' },
  'outros-aposentadoria-vip': { name: 'VIP Outros Aposentadoria', price: 1597, description: 'Serviço completo aposentadoria outros países' },
  
  // Reino Unido - Todas as categorias,  'uk-turismo-relatorio': { name: 'Relatório UK Turismo', price: 167, description: 'Relatório para turismo Reino Unido' },
  'uk-turismo-consultoria': { name: 'Consultoria UK Turismo', price: 447, description: 'Consultoria turismo Reino Unido' },
  'uk-turismo-vip': { name: 'VIP UK Turismo', price: 2197, description: 'Serviço completo turismo Reino Unido' },
  'uk-estudo-relatorio': { name: 'Relatório UK Estudo', price: 197, description: 'Relatório para estudo Reino Unido' },
  'uk-estudo-consultoria': { name: 'Consultoria UK Estudo', price: 497, description: 'Consultoria estudo Reino Unido' },
  'uk-estudo-vip': { name: 'VIP UK Estudo', price: 2497, description: 'Serviço completo estudo Reino Unido' },
  'uk-trabalho-relatorio': { name: 'Relatório UK Trabalho', price: 227, description: 'Relatório para trabalho Reino Unido' },
  'uk-trabalho-consultoria': { name: 'Consultoria UK Trabalho', price: 597, description: 'Consultoria trabalho Reino Unido' },
  'uk-trabalho-vip': { name: 'VIP UK Trabalho', price: 2797, description: 'Serviço completo trabalho Reino Unido' },
  'uk-investimento-relatorio': { name: 'Relatório UK Investimento', price: 347, description: 'Relatório para investimento Reino Unido' },
  'uk-investimento-consultoria': { name: 'Consultoria UK Investimento', price: 897, description: 'Consultoria investimento Reino Unido' },
  'uk-investimento-vip': { name: 'VIP UK Investimento', price: 3797, description: 'Serviço completo investimento Reino Unido' },
  'uk-arte-relatorio': { name: 'Relatório UK Arte', price: 247, description: 'Relatório para arte/cultura Reino Unido' },
  'uk-arte-consultoria': { name: 'Consultoria UK Arte', price: 547, description: 'Consultoria arte/cultura Reino Unido' },
  'uk-arte-vip': { name: 'VIP UK Arte', price: 2597, description: 'Serviço completo arte/cultura Reino Unido' },
  'uk-familia-relatorio': { name: 'Relatório UK Família', price: 187, description: 'Relatório para reunificação familiar Reino Unido' },
  'uk-familia-consultoria': { name: 'Consultoria UK Família', price: 477, description: 'Consultoria família Reino Unido' },
  'uk-familia-vip': { name: 'VIP UK Família', price: 2297, description: 'Serviço completo família Reino Unido' },
  'uk-religioso-relatorio': { name: 'Relatório UK Religioso', price: 167, description: 'Relatório para visto religioso Reino Unido' },
  'uk-religioso-consultoria': { name: 'Consultoria UK Religioso', price: 447, description: 'Consultoria religioso Reino Unido' },
  'uk-religioso-vip': { name: 'VIP UK Religioso', price: 2197, description: 'Serviço completo religioso Reino Unido' },
  'uk-aposentadoria-relatorio': { name: 'Relatório UK Aposentadoria', price: 157, description: 'Relatório para aposentadoria Reino Unido' },
  'uk-aposentadoria-consultoria': { name: 'Consultoria UK Aposentadoria', price: 397, description: 'Consultoria aposentadoria Reino Unido' },
  'uk-aposentadoria-vip': { name: 'VIP UK Aposentadoria', price: 1997, description: 'Serviço completo aposentadoria Reino Unido' },
  
  // Certidões - Nascimento,  'certidao-nascimento-individual': { name: 'Certidão de Nascimento Individual', price: 89, description: 'Uma certidão de nascimento', originalPrice: 149, features: ['Nascimento individual', 'Válida em todo território nacional', 'PDF enviado por email', 'Via física por correios (opcional)', 'Suporte especializado', 'Garantia de autenticidade'] },
  'certidao-nascimento-familiar': { name: 'Kit Familiar Nascimento', price: 249, description: 'Até 3 certidões de nascimento', originalPrice: 399, features: ['Nascimento para toda a família', 'Desconto de 30%', 'Entrega simultânea em PDF', 'SEDEX incluído para via física', 'Prioridade no atendimento', 'Validação prévia gratuita'] },
  'certidao-nascimento-completo': { name: 'Pacote Completo Nascimento', price: 449, description: 'Certidões de nascimento ilimitadas + extras', originalPrice: 699, features: ['Certidões ilimitadas', 'Validação jurídica incluída', 'PDF prioritário em 24-48h', 'Entrega expressa por motoboy', 'Suporte prioritário 24/7', 'Garantia estendida 6 meses', 'Consultoria documental gratuita'] },

  // Certidões - Casamento,  'certidao-casamento-individual': { name: 'Certidão de Casamento Individual', price: 89, description: 'Uma certidão de casamento', originalPrice: 149, features: ['Casamento individual', 'Válida em todo território nacional', 'PDF enviado por email', 'Via física por correios (opcional)', 'Suporte especializado', 'Garantia de autenticidade'] },
  'certidao-casamento-familiar': { name: 'Kit Familiar Casamento', price: 249, description: 'Até 3 certidões de casamento', originalPrice: 399, features: ['Casamento para toda a família', 'Desconto de 30%', 'Entrega simultânea em PDF', 'SEDEX incluído para via física', 'Prioridade no atendimento', 'Validação prévia gratuita'] },
  'certidao-casamento-completo': { name: 'Pacote Completo Casamento', price: 449, description: 'Certidões de casamento ilimitadas + extras', originalPrice: 699, features: ['Certidões ilimitadas', 'Validação jurídica incluída', 'PDF prioritário em 24-48h', 'Entrega expressa por motoboy', 'Suporte prioritário 24/7', 'Garantia estendida 6 meses', 'Consultoria documental gratuita'] },

  // Certidões - Óbito,  'certidao-obito-individual': { name: 'Certidão de Óbito Individual', price: 89, description: 'Uma certidão de óbito', originalPrice: 149, features: ['Óbito individual', 'Válida em todo território nacional', 'PDF enviado por email', 'Via física por correios (opcional)', 'Suporte especializado', 'Garantia de autenticidade'] },
  'certidao-obito-familiar': { name: 'Kit Familiar Óbito', price: 249, description: 'Até 3 certidões de óbito', originalPrice: 399, features: ['Óbito para toda a família', 'Desconto de 30%', 'Entrega simultânea em PDF', 'SEDEX incluído para via física', 'Prioridade no atendimento', 'Validação prévia gratuita'] },
  'certidao-obito-completo': { name: 'Pacote Completo Óbito', price: 449, description: 'Certidões de óbito ilimitadas + extras', originalPrice: 699, features: ['Certidões ilimitadas', 'Validação jurídica incluída', 'PDF prioritário em 24-48h', 'Entrega expressa por motoboy', 'Suporte prioritário 24/7', 'Garantia estendida 6 meses', 'Consultoria documental gratuita'] }
}

function CheckoutPageContent() {
  const searchParams = useSearchParams()
  const [productId, setProductId] = useState<string>('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [contractAccepted, setContractAccepted] = useState(false)
  const [showContract, setShowContract] = useState(false)
  const [upsellTotal, setUpsellTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [digitalSignature, setDigitalSignature] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [signatureTimestamp, setSignatureTimestamp] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Brasil'
  })

  useEffect(() => {
    const id = searchParams.get('product') || 'relatorio-premium'
    setProductId(id)
    // Adicionar um pequeno delay para evitar flash da mensagem de erro
    setTimeout(() => setIsLoading(false), 100)
    
    // Capturar IP e timestamp para assinatura digital
    
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress('IP não disponível'))
      
    setSignatureTimestamp(new Date().toISOString())
  }, [searchParams])

  const product = PRODUCTS[productId as keyof typeof PRODUCTS]
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando checkout seguro...</p>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto solicitado não está disponível no momento.</p>
          <a href="/precos" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Voltar aos Planos
          </a>
        </div>
      </div>
    )
  }

  // Estratégia de preços detalhada

  const getAdultPrice = () => product.price
  const getChildPrice = () => Math.round(product.price * 0.7) // 30% desconto
  const getChildDiscount = () => Math.round(product.price * 0.3) // Economia por criança
  
  const getQuantityDiscount = (adultCount: number) => {
    // Desconto por quantidade aplica SOMENTE aos adultos (crianças já têm 30% off)
    if (adultCount >= 5) return 0.15 // 15% desconto para 5+ adultos
    if (adultCount >= 3) return 0.10 // 10% desconto para 3-4 adultos
    return 0
  }
  
  const getPIXDiscount = () => paymentMethod === 'pix' ? 0.05 : 0 // 5% desconto PIX  
  const calculateSubtotal = () => {
    return (adults * getAdultPrice()) + (children * getChildPrice())
  }
  
  const getQuantityDiscountAmount = () => {
    // Desconto de quantidade aplica SOMENTE no valor dos adultos
    const adultSubtotal = adults * getAdultPrice()
    const discount = getQuantityDiscount(adults)
    return Math.round(adultSubtotal * discount)
  }
  
  const getAfterQuantityDiscount = () => {
    return calculateSubtotal() - getQuantityDiscountAmount()
  }
  
  const getPIXDiscountAmount = () => {
    return Math.round(getAfterQuantityDiscount() * getPIXDiscount())
  }
  
  const calculateTotal = () => {
    return getAfterQuantityDiscount() - getPIXDiscountAmount() + upsellTotal
  }
  
  const getTotalSavings = () => {
    const childrenDiscount = children * getChildDiscount()
    const quantityDiscount = getQuantityDiscountAmount()
    const pixDiscount = getPIXDiscountAmount()
    return childrenDiscount + quantityDiscount + pixDiscount
  }

  const generateContract = () => {
    const today = new Date().toLocaleDateString('pt-BR')
    const totalAmount = calculateTotal()
    
    return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ASSESSORIA EM IMIGRAÇÃO

CONTRATANTE: ${customerInfo.name || '[NOME DO CLIENTE]'}
E-mail: ${customerInfo.email || '[EMAIL DO CLIENTE]'}
Telefone: ${customerInfo.phone || '[TELEFONE DO CLIENTE]'}
País de origem: ${customerInfo.country}
IP de origem: ${ipAddress}
Data/hora da assinatura: ${new Date(signatureTimestamp).toLocaleString('pt-BR')}

CONTRATADA: VISA2ANY ASSESSORIA EM IMIGRAÇÃO LTDA
CNPJ: XX.XXX.XXX/0001-XX

OBJETO DO CONTRATO:
Prestação de serviços de assessoria especializada em imigração através do produto "${product.name}".

ESPECIFICAÇÕES DO SERVIÇO:
- Produto: ${product.name}
- Descrição: ${product.description}
- Quantidade de pessoas: ${adults + children} (${adults} adulto${adults > 1 ? 's' : ''} + ${children} criança${children !== 1 ? 's' : ''})
- Valor total: R$ ${totalAmount.toFixed(2).replace('.', ',')}
- Forma de pagamento: ${paymentMethod.toUpperCase()}
- Data da contratação: ${today}

CLÁUSULAS CONTRATUAIS:

1. DO OBJETO
A CONTRATADA compromete-se a prestar serviços de assessoria em imigração conforme especificado no produto contratado.

2. DAS OBRIGAÇÕES DA CONTRATADA
2.1. Fornecer orientações especializadas sobre processos de imigração
2.2. Entregar o produto contratado dentro do prazo estabelecido
2.3. Manter sigilo absoluto sobre as informações fornecidas pelo CONTRATANTE
2.4. Prestar suporte técnico conforme especificado no produto

3. DAS OBRIGAÇÕES DO CONTRATANTE
3.1. Fornecer informações verdadeiras e atualizadas
3.2. Efetuar o pagamento nos termos acordados
3.3. Seguir as orientações fornecidas pela CONTRATADA

4. DO VALOR E PAGAMENTO
4.1. O valor total do serviço é de R$ ${totalAmount.toFixed(2).replace('.', ',')}
4.2. O pagamento será efetuado via ${paymentMethod.toUpperCase()}
4.3. O acesso aos serviços será liberado após confirmação do pagamento

5. DOS PRAZOS
5.1. Relatórios e análises: entrega imediata após confirmação do pagamento
5.2. Consultorias: agendamento em até 24 horas após pagamento

6. DAS GARANTIAS
6.1. A CONTRATADA garante a qualidade dos serviços prestados
6.2. Em caso de erro comprovado da CONTRATADA, o serviço será refeito sem custos

7. DAS LIMITAÇÕES
7.1. A CONTRATADA não garante aprovação de vistos ou processos de imigração
7.2. A aprovação depende exclusivamente das autoridades governamentais
7.3. A CONTRATADA se responsabiliza apenas pela qualidade da assessoria prestada

8. DO CANCELAMENTO
8.1. O CONTRATANTE pode cancelar em até 7 dias (direito de arrependimento)
8.2. Após início da prestação do serviço, não haverá reembolso

9. DA PROTEÇÃO DE DADOS
9.1. Todos os dados são tratados conforme LGPD (Lei 13.709/2018)
9.2. Dados pessoais serão utilizados apenas para prestação do serviço

10. DO FORO
Fica eleito o foro da comarca de São Paulo/SP para dirimir dúvidas oriundas deste contrato.

Data: ${today}

ASSINATURA DIGITAL VÁLIDA:
CONTRATANTE: ${customerInfo.name || '[NOME DO CLIENTE]'}
Assinatura digital: ${digitalSignature || 'Aguardando confirmação...'}
IP de origem: ${ipAddress}
Data/hora: ${new Date(signatureTimestamp).toLocaleString('pt-BR')}
Hash de validação: ${btoa(`${customerInfo.name}-${customerInfo.email}-${signatureTimestamp}`).substring(0, 16)}

CONTRATADA: VISA2ANY ASSESSORIA EM IMIGRAÇÃO LTDA
Representante Legal: Sofia IA (Sistema Automatizado)
Registro: VISA2ANY-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}

VALIDADE JURÍDICA:
Este contrato foi assinado digitalmente conforme Lei 14.063/2020 e MP 2.200-2/2001.
A assinatura digital possui a mesma validade jurídica de uma assinatura manuscrita.
    `
  }

  const handlePurchase = async () => {
    setIsProcessing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      alert(`✅ Pagamento aprovado! 
      
Produto: ${product.name}
Pessoas: ${adults + children} (${adults} adulto${adults > 1 ? 's' : ''} + ${children} criança${children !== 1 ? 's' : ''})
Método: ${paymentMethod.toUpperCase()}
Total: R$ ${calculateTotal().toFixed(2).replace('.', ',')}
Economia total: R$ ${getTotalSavings().toFixed(2).replace('.', ',')}

Obrigado ${customerInfo.name}! Você receberá um email em ${customerInfo.email} com as próximas instruções.`)
      
      // Simular redirecionamento baseado no produto
      
      if (productId === 'relatorio-premium') {
        window.open('/download/relatorio-premium-sample.pdf', '_blank')
      }
      
    } catch (error) {
      alert('❌ Erro no pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpsellChange = (productId: string, priceChange: number) => {
    setUpsellTotal(prev => prev + priceChange)
  }

  const isStepValid = (step: number) => {
    if (step === 1) return true
    if (step === 2) return adults > 0
    if (step === 3) return customerInfo.name && customerInfo.email && customerInfo.phone
    if (step === 4) return contractAccepted
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      <div className="pb-20">
      {/* Contract Modal */}
      {showContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Contrato de Prestação de Serviços</h3>
                <button
                  onClick={() => setShowContract(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Leia atentamente os termos do contrato</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {generateContract()}
              </pre>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="accept-contract"
                    checked={contractAccepted}
                    onChange={(e) => setContractAccepted(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="accept-contract" className="ml-2 text-sm text-gray-700">
                    Aceito os termos e condições deste contrato
                  </label>
                </div>
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowContract(false)}
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => setShowContract(false)}
                    disabled={!contractAccepted}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Confirmar Aceite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/precos" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar aos planos
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Checkout Seguro</h1>
              <p className="text-lg font-medium text-blue-600">{product.name}</p>
              <p className="text-sm text-gray-600">🔒 Pagamento protegido SSL</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: 'Produto', icon: User },
              { number: 2, title: 'Quantidade', icon: Users },
              { number: 3, title: 'Dados', icon: CreditCard },
              { number: 4, title: 'Pagamento', icon: Shield }
            ].map(({ number, title, icon: Icon }) => (
              <div key={number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {currentStep > number ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Passo {number}
                  </div>
                  <div className={`text-xs ${
                    currentStep >= number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {title}
                  </div>
                </div>
                {number < 4 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-8 ${
                    currentStep > number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-max">
          
          {/* Left Column - Steps */}
          <div className="md:col-span-2 lg:col-span-2 overflow-visible">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 min-h-fit h-auto overflow-visible">
              
              {/* Step 1 - Produto */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirme seu produto</h2>
                    <p className="text-gray-600">Verifique se escolheu o plano ideal para suas necessidades</p>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="text-3xl font-bold text-blue-600">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                          <span className="text-lg text-gray-500 font-normal"> /pessoa</span>
                        </div>
                        
                        {/* Destaque dos descontos disponíveis */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-green-600 text-sm">
                            <Gift className="h-4 w-4 mr-2" />
                            <span>30% OFF para crianças até 12 anos</span>
                          </div>
                          <div className="flex items-center text-blue-600 text-sm">
                            <Users className="h-4 w-4 mr-2" />
                            <span>10% OFF para 3+ adultos | 15% OFF para 5+ adultos</span>
                          </div>
                          <div className="flex items-center text-purple-600 text-sm">
                            <Tag className="h-4 w-4 mr-2" />
                            <span>5% OFF adicional pagando via PIX</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Selecionado
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto text-lg"
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2 - Quantidade */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quantas pessoas?</h2>
                    <p className="text-gray-600">Selecione quantas pessoas precisam da assessoria</p>
                  </div>

                  {/* Adultos */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Adultos</h3>
                          <p className="text-sm text-gray-600">R$ {getAdultPrice().toFixed(2).replace('.', ',')} por pessoa</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="h-12 w-12 p-0"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="font-bold text-2xl w-16 text-center">{adults}</span>
                        <Button
                          variant="outline"
                          onClick={() => setAdults(adults + 1)}
                          className="h-12 w-12 p-0"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Crianças */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                          <Baby className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Crianças (até 12 anos)</h3>
                          <p className="text-sm text-gray-600">
                            R$ {getChildPrice().toFixed(2).replace('.', ',')} por criança 
                            <span className="text-green-600 font-medium"> (30% desconto = -R$ {getChildDiscount().toFixed(2).replace('.', ',')} cada)</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="h-12 w-12 p-0"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="font-bold text-2xl w-16 text-center">{children}</span>
                        <Button
                          variant="outline"
                          onClick={() => setChildren(children + 1)}
                          className="h-12 w-12 p-0"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Desconto por quantidade */}
                    {getQuantityDiscount(adults) > 0 && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <Check className="h-5 w-5 mr-2" />
                          <span className="font-medium">
                            🎉 Desconto de {(getQuantityDiscount(adults) * 100).toFixed(0)}% aplicado aos adultos!
                          </span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Economia de R$ {getQuantityDiscountAmount().toFixed(2).replace('.', ',')} no valor dos adultos
                        </p>
                      </div>
                    )}
                    
                    {/* Preview da economia total */}
                    {(children > 0 || getQuantityDiscount(adults) > 0) && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-purple-700">
                            <Percent className="h-5 w-5 mr-2" />
                            <span className="font-medium">Economia total até agora:</span>
                          </div>
                          <span className="font-bold text-purple-700">
                            R$ {(children * getChildDiscount() + getQuantityDiscountAmount()).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <p className="text-sm text-purple-600 mt-1">
                          + 5% adicional se pagar via PIX no próximo passo
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upsells Section */}
                  <CheckoutUpsells
                    currentProductId={productId}
                    currentPrice={product.price}
                    onAddUpsell={handleUpsellChange}
                    className="mt-8"
                  />

                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="px-8 py-3 h-auto text-lg"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      disabled={!isStepValid(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto text-lg"
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 - Dados */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Seus dados</h2>
                    <p className="text-gray-600">Precisamos dessas informações para processar seu pedido</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País de origem
                      </label>
                      <select
                        value={customerInfo.country}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Brasil">Brasil</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Angola">Angola</option>
                        <option value="Moçambique">Moçambique</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 h-auto text-lg"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(4)}
                      disabled={!isStepValid(3)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto text-lg"
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4 - Pagamento */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalizar pagamento</h2>
                    <p className="text-gray-600">Escolha sua forma de pagamento preferida</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div 
                      className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                        paymentMethod === 'pix' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <div className="text-2xl mb-2">💳</div>
                      <div className="font-semibold text-gray-700">PIX</div>
                      <div className="text-xs text-green-600 font-medium">5% desconto adicional</div>
                      <div className="text-xs text-gray-600">Aprovação instantânea</div>
                    </div>
                    
                    <div 
                      className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                        paymentMethod === 'cartao' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setPaymentMethod('cartao')}
                    >
                      <div className="text-2xl mb-2">💳</div>
                      <div className="font-semibold text-gray-700">Cartão</div>
                      <div className="text-xs text-blue-600">3x sem juros</div>
                      <div className="text-xs text-gray-600">4-12x com juros</div>
                    </div>
                    
                    <div 
                      className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                        paymentMethod === 'boleto' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setPaymentMethod('boleto')}
                    >
                      <div className="text-2xl mb-2">📄</div>
                      <div className="font-semibold text-gray-700">Boleto</div>
                      <div className="text-xs text-orange-600">3 dias úteis</div>
                      <div className="text-xs text-gray-600">Qualquer banco</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 text-green-700">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Pagamento 100% seguro e protegido</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-green-600">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4" />
                        <span>Criptografia SSL 256 bits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4" />
                        <span>Seus dados nunca são armazenados</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4" />
                        <span>Acesso imediato após confirmação</span>
                      </div>
                    </div>
                  </div>

                  {/* Contrato de Prestação de Serviços */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 text-blue-700 mb-3">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">Contrato de Prestação de Serviços</span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>Produto:</strong> {product.name}</div>
                        <div><strong>Cliente:</strong> {customerInfo.name}</div>
                        <div><strong>Valor:</strong> R$ {calculateTotal().toFixed(2).replace('.', ',')}</div>
                        <div><strong>Pessoas:</strong> {adults + children} ({adults} adulto{adults > 1 ? 's' : ''} + {children} criança{children !== 1 ? 's' : ''})</div>
                        <div className="text-blue-600 font-medium">...</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => setShowContract(true)}
                        className="w-full text-left p-3 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        📄 Ler contrato completo (obrigatório)
                      </button>
                      
                      {/* Assinatura Digital */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-800 mb-2">✍️ Assinatura Digital</h5>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-yellow-700 mb-1">
                              Digite seu nome completo como assinatura digital *
                            </label>
                            <input
                              type="text"
                              value={digitalSignature}
                              onChange={(e) => setDigitalSignature(e.target.value)}
                              placeholder="Seu nome completo (igual ao documento)"
                              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            />
                          </div>
                          <div className="text-xs text-yellow-700">
                            <p>🔒 <strong>Assinatura Digital Válida:</strong> Conforme Lei 14.063/2020</p>
                            <p>📍 IP: {ipAddress} | ⏰ {new Date(signatureTimestamp).toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="accept-terms"
                          checked={contractAccepted}
                          onChange={(e) => setContractAccepted(e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer">
                          Li e aceito integralmente os termos do contrato de prestação de serviços e confirmo que minha assinatura digital acima é autêntica e válida.
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      
                      {(!contractAccepted || !digitalSignature.trim()) && (
                        <p className="text-xs text-red-600">
                          ⚠️ É obrigatório ler o contrato, assinar digitalmente e aceitar os termos para prosseguir
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3 h-auto text-lg"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={handlePurchase}
                      disabled={isProcessing || !contractAccepted || !digitalSignature.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 h-auto text-xl font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processando...
                        </div>
                      ) : (!contractAccepted || !digitalSignature.trim()) ? (
                        <div className="flex items-center">
                          <FileText className="mr-2 h-6 w-6" />
                          Complete contrato e assinatura
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-6 w-6" />
                          Pagar R$ {calculateTotal().toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column - Resumo Detalhado */}
          <div className="md:col-span-1 lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-8 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resumo Detalhado</h3>
              
              <div className="space-y-4 mb-6">
                {/* Produto base */}
                <div className="flex justify-between">
                  <span className="text-gray-600">{product.name}</span>
                  <span className="font-medium">Base</span>
                </div>
                
                {/* Adultos */}
                {adults > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{adults} Adulto{adults > 1 ? 's' : ''}</span>
                    <span className="font-medium">R$ {(adults * getAdultPrice()).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                
                {/* Crianças */}
                {children > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{children} Criança{children > 1 ? 's' : ''}</span>
                      <span className="font-medium">R$ {(children * getChildPrice()).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-green-600 text-sm">
                      <span className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        Desconto crianças (30%)
                      </span>
                      <span className="font-medium">-R$ {(children * getChildDiscount()).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </>
                )}
                
                {/* Subtotal antes dos descontos */}
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {calculateSubtotal().toFixed(2).replace('.', ',')}</span>
                </div>
                
                {/* Desconto por quantidade */}
                {getQuantityDiscountAmount() > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      Desconto adultos ({(getQuantityDiscount(adults) * 100).toFixed(0)}%)
                    </span>
                    <span className="font-medium">-R$ {getQuantityDiscountAmount().toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                
                {/* Desconto PIX */}
                {getPIXDiscountAmount() > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span className="flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-1" />
                      Desconto PIX (5%)
                    </span>
                    <span className="font-medium">-R$ {getPIXDiscountAmount().toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                
                {/* Extras/Upsells */}
                {upsellTotal > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Extras selecionados
                    </span>
                    <span className="font-medium">+R$ {upsellTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
              </div>
              
              {/* Total final */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-2xl font-bold text-blue-600">
                  <span>Total Final</span>
                  <span>R$ {calculateTotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Para {adults + children} pessoa{adults + children !== 1 ? 's' : ''}
                </p>
                
                {/* Economia total */}
                {getTotalSavings() > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between text-green-700">
                      <span className="flex items-center text-sm font-medium">
                        <Percent className="h-4 w-4 mr-1" />
                        Economia total:
                      </span>
                      <span className="font-bold">R$ {getTotalSavings().toFixed(2).replace('.', ',')}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Preço original seria R$ {((adults + children) * getAdultPrice()).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                )}
              </div>

              {/* Benefícios */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Acesso imediato</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>Garantia de qualidade</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  <span>Pagamento seguro</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Banner de Afiliados pós-compra */}
      <div className="py-12 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Obrigado pela confiança!</h2>
            <p className="text-gray-600">Agora que você conhece a qualidade dos nossos serviços...</p>
          </div>
          <AffiliateBanner variant="compact" />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando checkout seguro...</p>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  )
}