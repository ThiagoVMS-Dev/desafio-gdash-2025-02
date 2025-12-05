# Weather System — Entrega Completa

Sistema para coleta, processamento e visualização de dados climáticos:
- Collector (Python) usando Open-Meteo → publica em RabbitMQ
- Worker (Go) consome fila e POST para API NestJS
- API (NestJS + MongoDB) armazena leituras, gera insights e exporta CSV/XLSX
- Frontend (React + Vite + Tailwind) exibe dashboard, CRUD de usuários
- Orquestração: Docker Compose

---

## Requisitos locais
- Docker Desktop (com Compose)
- (opcional) Go 1.21 e Python 3.11 para executar worker/collector localmente

---

## Rodando tudo via Docker Compose (recomendado)
1. Copie `.env.example` para `.env` e ajuste se necessário:
   ```bash
   cp .env.example .env
   docker compose up --build

Serviços expostos:
- Frontend: http://localhost:5173
- API: http://localhost:3000
- RabbitMQ Management: http://localhost:15672 (guest/guest)
- MongoDB: 27017

## Notas
- A API cria um usuário admin padrão na primeira inicialização (DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD).
- O endpoint `POST /api/weather` exige header `X-API-TOKEN` igual a WORKER_API_TOKEN configurado.
- OpenAI key é opcional; se fornecida, insights usarão a API.
