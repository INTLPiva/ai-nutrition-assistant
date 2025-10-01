# 🌱 NutriFácil

NutriFácil é um assistente de nutrição com **IA** que ajuda usuários a obter planos alimentares personalizados de forma simples e acessível.  
O projeto é composto por três partes principais:

- **Backend** → API responsável por gerenciar sessões, mensagens, geração de planos e exportação de relatórios.
- **Frontend (Web)** → Interface web para interação com o assistente, visualização dos planos e exportação em PDF.
- **App (Mobile)** → Aplicativo com experiência otimizada para dispositivos móveis.

---

## 📂 Estrutura do repositório

```
├── app/         # Aplicativo Mobile
├── backend/     # API
└── frontend/    # Aplicação Web
```

Cada pasta possui seu próprio **README.md** detalhando instalação, configuração e execução.

---

## 🚀 Tecnologias principais

- **Backend:** Node.js, Fastify, LangChain, Gemini API, PDF export
- **Frontend:** React (Vite), TypeScript, Tailwind
- **App:** React Native (Expo), TypeScript, NativeWind

---

## 🔗 Fluxo Geral

1. O **usuário** interage com o **frontend** (web) ou **app** (mobile).
2. As mensagens são enviadas para o **backend**, que utiliza **IA (Gemini)** para processar.
3. O backend retorna a resposta formatada para os clientes.
4. O usuário pode salvar/exportar o plano em **PDF**.

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit as mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
