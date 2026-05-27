---
title: VedaAI Assessment Creator
emoji: 📝
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# VedaAI Assessment Creator

VedaAI Assessment Creator is a full-stack, AI-powered application designed to help educators automatically generate highly structured, customized examination papers from their own reference materials using Groq's LLM API.

## System Architecture

The application uses an asynchronous microservice architecture to handle long-running LLM generation tasks without blocking the client.

```mermaid
graph TD
    Client[Next.js Frontend] -->|REST API| API[Express Server]
    Client <-->|WebSocket| WS[WebSocket Service]
    API -->|Persist Assignment| DB[(MongoDB)]
    API -->|Enqueue Generation| Queue[(Redis / BullMQ)]
    Queue --> Worker[Background Generation Worker]
    Worker -->|Extract Text| Parse[PDF/TXT Parser]
    Worker -->|Prompt LLM| Groq[Groq API llama3-70b]
    Groq --> Worker
    Worker -->|Update Status & Save Paper| DB
    Worker -->|Broadcast Progress| WS
```

## File Structure

The project is structured as an NPM Monorepo containing a Next.js frontend, an Express backend, and a shared types package.

```text
assesscreator/
├── backend/                  # Express API & Background Workers
│   ├── src/
│   │   ├── config/           # MongoDB and Redis configurations
│   │   ├── models/           # Mongoose Data Models
│   │   ├── routes/           # REST API Endpoints
│   │   ├── services/         # Queue and WebSocket services
│   │   └── workers/          # BullMQ Worker and Groq LLM integration
│   └── package.json
├── frontend/                 # Next.js Application (App Router)
│   ├── src/
│   │   ├── app/              # Routes (Dashboard, Form, Paper View)
│   │   ├── components/       # Reusable React UI Components
│   │   ├── hooks/            # Custom Hooks (WebSocket Client)
│   │   └── store/            # Zustand global state management
│   └── package.json
├── packages/                 
│   └── shared/               # Shared Zod Schemas & TypeScript Types
├── Dockerfile                # Configured for Hugging Face (Self-contained)
├── start.sh                  # Bootstraps Mongo, Redis, and Node apps
└── docker-compose.yml        # Local development environment
```

## Deployment
This repository is configured to run fully self-contained on Hugging Face Spaces (Docker SDK), meaning it provisions its own internal MongoDB and Redis daemons within the container.
