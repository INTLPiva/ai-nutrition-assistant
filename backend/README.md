# 🥗 Nutrition Assistant Backend

Backend em Node.js com TypeScript e Fastify para um assistente nutricional inteligente, integrado com LangChain e Gemini Pro.

## 🚀 Funcionalidades

- **Assistente Nutricional Inteligente**: Conduz conversas naturais para coletar dados do usuário
- **Questionário Estruturado**: Sequência lógica de perguntas sem repetições
- **Validação de Dados**: Validação robusta de entradas numéricas e categóricas
- **Geração de Planos**: Planos alimentares personalizados baseados em IA
- **Exportação PDF**: Geração de PDFs formatados com o plano nutricional
- **Gerenciamento de Sessões**: Sistema de sessões em memória com cleanup automático
- **API RESTful**: Endpoints bem documentados e tipados

## 🛠️ Tecnologias

- **Runtime**: Node.js + TypeScript
- **Framework**: Fastify
- **IA**: LangChain + Google Gemini Pro
- **Validação**: Zod
- **PDF**: PDFKit
- **Testes**: Vitest
- **Linting**: ESLint + TypeScript ESLint

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Chave da API do Google Gemini Pro

## 🔧 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/INTLPiva/ai-nutrition-assistant.git
cd backend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env
```

Edite o arquivo `.env` com suas configurações:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
SESSION_TIMEOUT=3600000
```

4. **Execute o servidor**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📡 API Endpoints

### Assistente Nutricional

- `POST /message` - Processar mensagem do usuário
  ```json
  {
    "sessionId": "uuid-string",
    "message": "Tenho 25 anos"
  }
  ```

### Gerenciamento de Sessões

- `GET /session/:sessionId` - Obter informações da sessão
- `DELETE /session/:sessionId` - Deletar sessão

### Exportação PDF

- `POST /export-pdf` - Gerar PDF do plano nutricional

## 🔄 Fluxo do Assistente

O assistente segue uma sequência estruturada de coleta de dados:

1. **Permissão**: Solicita permissão para iniciar a avaliação
2. **Dados Pessoais**: Idade, sexo, altura, peso
3. **Estilo de Vida**: Nível de atividade física, objetivos
4. **Preferências**: Número de refeições, restrições alimentares
5. **Saúde**: Alergias, preferências, condições médicas
6. **Geração**: Cria plano personalizado com IA

## 📊 Exemplo de JSON Coletado

```json
{
  "completed": true,
  "collected_at": "2025-09-23T12:34:56Z",
  "user": {
    "age": 28,
    "sex": "feminino",
    "height_cm": 170,
    "weight_kg": 68,
    "activity_level": "moderado",
    "goal": "emagrecimento",
    "meals_per_day": 4,
    "dietary_restrictions": ["lactose"],
    "allergies": ["amendoim"],
    "preferences": ["não gosta de peixe"],
    "medical_conditions": ["hipertensão"],
    "timezone": "America/Sao_Paulo"
  }
}
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch
```

## 🏗️ Estrutura do Projeto

```
src/
├── config/          # Configurações (env, etc.)
├── middleware/      # Middlewares (logger, error handler)
├── routes/         # Definição das rotas
├── services/       # Lógica de negócio
├── tests/          # Testes unitários
├── types/          # Definições de tipos TypeScript
├── utils/          # Utilitários e helpers
└── index.ts        # Ponto de entrada
├── server.ts       # Configuração do servidor Fastify
```

## 🛡️ Recursos de Segurança

- **Validação**: Validação rigorosa de entrada com Zod
- **Rate Limiting**: Proteção contra abuse (configurável)
- **Error Handling**: Tratamento seguro de erros

## 🔧 Configurações Avançadas

### Timeouts de Sessão

Sessões são automaticamente limpas após o período de inatividade configurado em `SESSION_TIMEOUT`.
