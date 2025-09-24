# 📡 API Documentation - Nutrition Assistant

## Base URL

```
http://localhost:3000
```

## Authentication

Nenhuma autenticação necessária para desenvolvimento.

---

## 🏥 Health Check Endpoints

### GET /health

Verifica se o servidor está funcionando.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

### GET /health/detailed

Retorna informações detalhadas do sistema.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": {
    "seconds": 3661,
    "human": "1h 1m 1s"
  },
  "memory": {
    "rss": "45MB",
    "heapTotal": "25MB",
    "heapUsed": "20MB",
    "external": "2MB"
  },
  "sessions": {
    "active": 3
  }
}
```

---

## 💬 Message Processing

### POST /message

Processa mensagens do assistente nutricional.

**Request Body:**

```json
{
  "sessionId": "uuid-string",
  "message": "Tenho 25 anos"
}
```

**Response:**

```json
{
  "json": {
    "completed": false,
    "user": {
      "age": 25
    }
  },
  "text": "Perfeito! Qual é o seu sexo/gênero? (masculino, feminino ou outro)",
  "done": false
}
```

**Error Response:**

```json
{
  "error": "VALIDATION_ERROR",
  "message": "sessionId is required and must be a non-empty string"
}
```

---

## 📊 Session Management

### GET /session/:sessionId

Obtém informações sobre uma sessão específica.

**Response:**

```json
{
  "sessionId": "uuid-string",
  "createdAt": "2025-01-20T10:00:00.000Z",
  "lastActivity": "2025-01-20T10:15:00.000Z",
  "currentStep": 5,
  "completed": false,
  "messagesCount": 10
}
```

### DELETE /session/:sessionId

Remove uma sessão específica.

**Response:**

```json
{
  "message": "Session deleted successfully",
  "sessionId": "uuid-string"
}
```

### GET /sessions

Retorna estatísticas gerais das sessões (debug).

**Response:**

```json
{
  "totalSessions": 5,
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

---

## 📄 PDF Generation

### POST /export-pdf

Gera PDF do plano nutricional para download.

**Request Body:**

```json
{
  "json": {
    "completed": true,
    "collected_at": "2025-01-20T10:30:00.000Z",
    "user": {
      "age": 28,
      "sex": "feminino",
      "height_cm": 170,
      "weight_kg": 68,
      "activity_level": "moderado",
      "goal": "emagrecimento",
      "meals_per_day": 4
    }
  },
  "text": "# PLANO ALIMENTAR PERSONALIZADO\n\n## Resumo..."
}
```

**Response:**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="plano-alimentar-{timestamp}.pdf"`
- Binary PDF data

### POST /preview-pdf

Gera PDF para visualização no browser.

**Request Body:** (mesmo formato do /export-pdf)

**Response:**

- Content-Type: `application/pdf`
- Content-Disposition: `inline`
- Binary PDF data

### GET /test-pdf

Gera um PDF de exemplo para testar a funcionalidade.

**Response:**

- Content-Type: `application/pdf`
- PDF com dados de exemplo

---

## 🔄 Conversation Flow

O assistente segue uma sequência estruturada:

1. **Permission (Step 0)**: Pede permissão para iniciar
2. **Age (Step 1)**: Coleta idade
3. **Sex (Step 2)**: Coleta sexo/gênero
4. **Height (Step 3)**: Coleta altura em cm
5. **Weight (Step 4)**: Coleta peso em kg
6. **Activity Level (Step 5)**: Nível de atividade física
7. **Goal (Step 6)**: Objetivo principal
8. **Meals Per Day (Step 7)**: Número de refeições
9. **Dietary Restrictions (Step 8)**: Restrições alimentares
10. **Allergies (Step 9)**: Alergias e intolerâncias
11. **Preferences (Step 10)**: Preferências alimentares
12. **Medical Conditions (Step 11)**: Condições médicas
13. **Complete (Step 12)**: Gera plano final

---

## 🚨 Error Codes

| Code                   | Description                  |
| ---------------------- | ---------------------------- |
| `VALIDATION_ERROR`     | Dados de entrada inválidos   |
| `SESSION_NOT_FOUND`    | Sessão não encontrada        |
| `INCOMPLETE_DATA`      | Dados do usuário incompletos |
| `PDF_GENERATION_ERROR` | Erro na geração do PDF       |
| `INTERNAL_ERROR`       | Erro interno do servidor     |

---

## 📝 Example Usage

### Complete Conversation Flow

```bash
# 1. Iniciar conversa
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","message":"Olá"}'

# 2. Responder perguntas
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","message":"Sim, pode começar"}'

curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","message":"25"}'

# ... continue até completar

# 3. Verificar sessão
curl http://localhost:3000/session/test-123

# 4. Gerar PDF (quando completed: true)
curl -X POST http://localhost:3000/export-pdf \
  -H "Content-Type: application/json" \
  -d @complete-user-data.json \
  --output plano-nutricional.pdf
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Test PDF generation
curl http://localhost:3000/test-pdf --output test.pdf

# Get sessions statistics
curl http://localhost:3000/sessions
```

---

## 🔧 Configuration

### Environment Variables

| Variable          | Description               | Default        | Required |
| ----------------- | ------------------------- | -------------- | -------- |
| `GEMINI_API_KEY`  | Google Gemini Pro API key | -              | ✅       |
| `PORT`            | Server port               | `3000`         | ❌       |
| `NODE_ENV`        | Environment               | `development`  | ❌       |
| `SESSION_TIMEOUT` | Session timeout (ms)      | `3600000` (1h) | ❌       |

### CORS Configuration

Development origins:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:19006` (Expo)
- `exp://192.168.1.1:8081` (Expo mobile)

---

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Manual Testing

```bash
# Start server
npm run dev

# Test basic functionality
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"manual-test","message":"Olá, posso começar?"}'
```

### Load Testing

```bash
# Install artillery (if needed)
npm install -g artillery

# Create test script artillery.yml:
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Message processing"
    requests:
      - post:
          url: "/message"
          json:
            sessionId: "load-test-{{ $randomString() }}"
            message: "Teste de carga"

# Run load test
artillery run artillery.yml
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Server won't start

```bash
# Check if port is available
lsof -i :3000

# Check environment variables
cat .env

# Check logs
npm run dev 2>&1 | tee server.log
```

#### 2. PDF generation fails

```bash
# Test PDF generation
curl http://localhost:3000/test-pdf -o test.pdf

# Check file size
ls -la test.pdf

# Check server logs for PDF errors
```

#### 3. Session not found

```bash
# List all active sessions
curl http://localhost:3000/sessions

# Check specific session
curl http://localhost:3000/session/your-session-id
```

#### 4. GEMINI_API_KEY issues

```bash
# Test API key manually
curl -X POST 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
```

### Health Monitoring

Monitor server health:

```bash
# Simple monitoring script
while true; do
  curl -s http://localhost:3000/health | jq '.status'
  sleep 10
done
```

---

## 📈 Performance

### Response Times (Expected)

- `/health`: < 5ms
- `/message`: 500ms - 3s (depending on AI processing)
- `/export-pdf`: 1s - 5s (depending on content size)
- `/session/*`: < 10ms

### Memory Usage

- Base server: ~30MB
- Per session: ~1KB
- PDF generation: +5-10MB temporarily

### Concurrency

- Recommended: 50 concurrent users
- Maximum tested: 100 concurrent users

---

## 🚀 Production Deployment

### Docker

```bash
# Build image
docker build -t nutrition-assistant .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key nutrition-assistant
```

### PM2

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start dist/index.js --name nutrition-assistant

# Set up auto-restart
pm2 startup
pm2 save
```

### Environment-specific configs

**Production `.env`:**

```env
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=your_production_key
SESSION_TIMEOUT=1800000
```

**Staging `.env`:**

```env
NODE_ENV=staging
PORT=3001
GEMINI_API_KEY=your_staging_key
SESSION_TIMEOUT=3600000
```

---

## 🔒 Security Considerations

### Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: no-referrer`

### Input Validation

- All user inputs are validated
- SQL injection protection (N/A - no database)
- XSS protection via headers

### Rate Limiting

Consider adding rate limiting for production:

```javascript
server.register(import("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});
```

---

## 📞 Support

### Logs Location

- Development: Console output
- Production: PM2 logs (`pm2 logs`)

### Monitoring

- Health endpoint: `/health/detailed`
- Session stats: `/sessions`
- Server metrics: Available in logs

### Contact

For issues or questions, check the server logs and health endpoints first.
