const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Caminho para sua aplicação Next.js para carregar next.config.js e arquivos .env
  dir: './',
})

// Configuração customizada do Jest
const customJestConfig = {
  // Adicionar mais setup options antes de cada teste rodar
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Automaticamente limpar mock calls e instances entre cada teste
  clearMocks: true,
  
  // Indicar que o código deve ser coletado de cobertura
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
  
  // Diretório onde os resultados de cobertura serão salvos
  coverageDirectory: 'coverage',
  
  // Ambiente de teste
  testEnvironment: 'jest-environment-jsdom',
  
  // Padrões de módulos a serem ignorados
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Transformar arquivos
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Ignorar arquivos de node_modules exceto alguns específicos
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Configurações de teste
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  
  // Ignorar arquivos
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  
  // Variáveis de ambiente para teste
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
}

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração Next.js que é async
module.exports = createJestConfig(customJestConfig)