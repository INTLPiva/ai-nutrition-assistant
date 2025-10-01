# 🥗 Nutrition Chat App

Um aplicativo React Native desenvolvido com Expo que implementa um chat inteligente com um agente nutricionista IA.

## 🚀 Características

- **Interface moderna** com NativeWind (TailwindCSS)
- **Chat interativo** com API de nutricionista IA
- **Gerenciamento de sessão** com AsyncStorage
- **Renderização de Markdown** para planos alimentares
- **Exportação para PDF** do plano final
- **TypeScript** para type safety
- **Componentes reutilizáveis** e código limpo

## 📋 Pré-requisitos

- Node.js 16+
- Expo CLI
- iOS Simulator ou Android Emulator (ou dispositivo físico)

## 🛠️ Instalação

1. **Clone ou crie o projeto:**

```bash
git clone https://github.com/INTLPiva/ai-nutrition-assistant.git
cd app
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
EXPO_PUBLIC_API_URL=your_api_url_here
```

4. **Execute o projeto:**

```bash
npm start
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── MessageBubble.tsx # Bolha de mensagem do chat
│   ├── LoadingIndicator.tsx # Indicador de carregamento
│   └── ChatInput.tsx     # Input de mensagem
├── screens/              # Telas da aplicação
│   └── ChatScreen.tsx    # Tela principal do chat
├── services/             # Serviços de API e storage
│   ├── apiService.ts     # Comunicação com API
│   └── storageService.ts # Gerenciamento AsyncStorage
└── types/                # Definições TypeScript
    └── message.ts        # Tipos de mensagem e estado
```

## 📱 Funcionalidades

### 1. Tela Inicial

- Botão "Começar conversa"
- Design acolhedor com ícone de nutrição
- Carregamento durante inicialização

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
- Armazenamento local com AsyncStorage
- Estado global do chat com React Hooks

## 🧩 Componentes Principais

### `ChatScreen.tsx`

- Gerencia todo o fluxo da conversa
- Controla estados de loading e completion
- Integração com API e storage

### `MessageBubble.tsx`

- Renderiza mensagens com estilo apropriado
- Suporte a Markdown para resposta final
- Timestamp das mensagens

### `ChatInput.tsx`

- Input responsivo com teclado
- Botão de envio inteligente
- Validação de mensagem

## 🔒 Tratamento de Erros

- **Conexão:** Alerts informativos para erros de rede
- **API:** Retry automático e mensagens de erro
- **PDF:** Fallback para salvar localmente se compartilhamento falhar
- **Storage:** Logs de erro para debugging

## 📚 Dependências Principais

- **@react-native-async-storage/async-storage**: Armazenamento local
- **axios**: Cliente HTTP
- **react-native-markdown-display**: Renderização Markdown
- **nativewind**: Styling com TailwindCSS
- **expo-file-system**: Manipulação de arquivos
- **expo-sharing**: Compartilhamento nativo
