# Career Guidance Chatbot (PathFinder)

A full-stack career guidance chatbot using **Node.js/Express**, **MongoDB**, **React**, and **Google Gemini**.

## Quick Start

### 1) Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- A Google Gemini API key

### 2) Clone & Install
```bash
unzip career-guidance-chatbot.zip
cd career-guidance-chatbot
```

#### Backend
```bash
cd backend
cp .env.example .env    # edit GEMINI_API_KEY and MONGO_URI
npm install
npm run dev             # starts on http://localhost:5000
```

#### Frontend (dev mode)
Open a new terminal:
```bash
cd frontend
npm install
npm start               # starts on http://localhost:3000 (proxy to backend 5000)
```

### 3) Single-Server Hosting (serve React from Express)
Build React and copy into backend/public:
```bash
cd backend
npm run build-frontend
npm start               # visit http://localhost:5000
```

### API
- `POST /api/chat` → `{ userId, message }` returns `{ reply }`. Also persists to MongoDB.
- `GET  /api/history?userId=...` returns conversation messages.

### Notes
- The bot is strictly scoped to **career guidance** (guardrailed in the prompt).
- Replace the hardcoded `userId` in the React app with a real auth/session in production.
