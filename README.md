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

This is the deployment for the VedaAI Assessment Creator.

## Architecture
- Next.js Frontend
- Express / Node.js Backend
- MongoDB & Redis (running self-contained inside the container)
- BullMQ for Async Jobs
- Groq API (`llama3-70b-8192`) for Question Generation
