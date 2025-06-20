# Visa2Any - Plataforma de Assessoria Internacional

Uma plataforma moderna e completa para assessoria de vistos, imigração e relocação internacional.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com SSR/SSG
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones SVG
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── page.tsx           # Página inicial
│   ├── layout.tsx         # Layout principal
│   ├── globals.css        # Estilos globais
│   └── servicos/          # Páginas de serviços
│       └── vistos/        # Página de vistos
└── components/            # Componentes reutilizáveis
    ├── ui/                # Componentes de UI
    │   └── button.tsx     # Componente Button
    ├── Header.tsx         # Cabeçalho
    ├── ContactForm.tsx    # Formulário de contato
    └── ServiceCard.tsx    # Card de serviço
```

## 🎨 Design System

### Cores Principais
- **Azul**: `#2563eb` - Cor primária da marca
- **Roxo**: `#7c3aed` - Cor secundária para gradientes
- **Cinza**: Tons variados para texto e backgrounds

### Componentes de UI
- **Button**: Variantes primary, secondary, outline, gradient
- **ServiceCard**: Cards reutilizáveis para serviços
- **ContactForm**: Formulário completo com validação

## 🏗️ Instalação e Execução

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em http://localhost:3000
```

### Docker

```bash
# Desenvolvimento
docker compose up visa2any-dev

# Produção
docker compose up visa2any
```

## 📱 Funcionalidades

### ✅ Implementadas
- [x] Página inicial responsiva
- [x] Header com navegação mobile
- [x] Seção hero com CTAs
- [x] Cards de serviços interativos
- [x] Seção de estatísticas
- [x] Depoimentos de clientes
- [x] Formulário de contato completo
- [x] Footer informativo
- [x] Página de serviços de visto
- [x] SEO otimizado
- [x] Design responsivo

### 🔄 Em Desenvolvimento
- [ ] Sistema de blog
- [ ] Dashboard de clientes
- [ ] Integração com APIs de pagamento
- [ ] Sistema de agendamento
- [ ] Chat online
- [ ] Área administrativa

## 🌐 Seções da Página

1. **Hero Section** - Apresentação principal com CTAs
2. **Estatísticas** - Números de sucesso da empresa
3. **Benefícios** - Por que escolher a Visa2Any
4. **Serviços** - Cards dos principais serviços
5. **Depoimentos** - Avaliações de clientes
6. **Contato** - Formulário e informações de contato

## 📄 Páginas

- `/` - Página inicial
- `/servicos/vistos` - Detalhes sobre assessoria de vistos

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linting do código
```

## 🐳 Docker

O projeto inclui configuração Docker otimizada:

- **Dockerfile**: Multi-stage build para produção
- **docker-compose.yml**: Serviços de desenvolvimento e produção
- **Volumes**: Hot reload em desenvolvimento

## 📈 Performance

- Build otimizado com Next.js
- Imagens otimizadas
- CSS modular com Tailwind
- Componentes lazy loading
- SEO otimizado

## 🔒 Segurança

- Headers de segurança configurados
- Validação de formulários
- Proteção XSS
- HTTPS ready

## 📞 Contato

Para dúvidas sobre o desenvolvimento:
- Email: contato@visa2any.com
- Website: https://visa2any.com

---

© 2024 Visa2Any. Todos os direitos reservados.