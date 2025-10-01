# 🥗 Nutrition Chat Web

Aplicação web React desenvolvida com Vite que implementa um chat inteligente com um agente nutricionista IA.

## 🚀 Características

- **Interface moderna** com TailwindCSS
- **Chat interativo** com API de nutricionista IA
- **Gerenciamento de sessão** com LocalStorage
- **Renderização de Markdown** para planos alimentares
- **Exportação para PDF** do plano final
- **TypeScript** para type safety
- **Componentes reutilizáveis** e código limpo

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🛠️ Instalação

1. **Clone ou crie o projeto:**

```bash
git clone https://github.com/INTLPiva/ai-nutrition-assistant.git
cd frontend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env
```

Edite o arquivo `.env` com suas configurações:

```env
VITE_API_URL=your_api_url_here
```

4. **Execute o projeto:**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5137`

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── MessageBubble.tsx # Bolha de mensagem do chat
│   ├── LoadingIndicator.tsx # Indicador de carregamento
│   └── ChatInput.tsx     # Input de mensagem
├── screens/              # Telas da aplicação
│   ├── ChatScreen.tsx    # Tela principal do chat
│   └── NutritionPlanScreen.tsx # Tela do plano
├── services/             # Serviços de API e storage
│   ├── apiService.ts     # Comunicação com API
│   └── storageService.ts # Gerenciamento LocalStorage
├── types/                # Definições TypeScript
│   └── message.ts        # Tipos de mensagem e estado
├── App.tsx               # Componente principal
├── main.tsx              # Entry point
└── index.css             # Estilos globais
```

## 📱 Funcionalidades

### 1. Tela Inicial

- Botão "Começar conversa"
- Design acolhedor com ícone
- Estado de carregamento

### 2. Chat Interface

- Mensagens do usuário (direita, verde)
- Respostas do bot (esquerda, cinza)
- Input fixo na parte inferior
- Scroll automático para novas mensagens
- Indicador de "digitando..."
- Timezone America/Sao_Paulo (GMT-3)

### 3. Tela do Plano Nutricional

- Limpeza automática do histórico
- Renderização Markdown em tela cheia
- Header com botão de voltar
- Botão "Baixar/Compartilhar PDF"

### 4. Gerenciamento de Estado

- Session ID único por conversa
- Armazenamento local com LocalStorage
- Estado global do chat com React Hooks

## 🧩 Componentes Principais

### `ChatScreen.tsx`

- Gerencia todo o fluxo da conversa
- Controla estados de loading e completion
- Integração com API e storage

### `NutritionPlanScreen.tsx`

- Exibe plano nutricional formatado
- Download de PDF
- Navegação de volta ao início

### `MessageBubble.tsx`

- Renderiza mensagens com estilo apropriado
- Suporte a Markdown para resposta final
- Timestamp em horário brasileiro

### `ChatInput.tsx`

- Input responsivo
- Botão de envio inteligente
- Suporte a Enter para enviar
- Validação de mensagem

## 🔒 Tratamento de Erros

- **Conexão:** Alerts informativos para erros de rede
- **API:** Retry e mensagens de erro
- **PDF:** Fallback para salvar localmente se download falhar
- **Storage:** Logs de erro para debugging

## 📚 Dependências Principais

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **axios**: ^1.6.2
- **react-markdown**: ^9.0.1
- **uuid**: ^9.0.1
- **tailwindcss**: ^3.4.0

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit as mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
