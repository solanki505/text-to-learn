# 📚 Text-to-Learn — AI-Powered Course Generator

Turn any topic into a fully structured online course using Claude AI.

## ✨ Features

- **Prompt → Course** — type any topic, get 4–6 modules with 3–4 lessons each
- **Rich Lesson Content** — headings, paragraphs, code blocks, video links, MCQ quizzes
- **Interactive Quizzes** — click options, get instant feedback + explanations
- **PDF Export** — download any lesson as a styled PDF
- **Copy Code** — one-click copy on every code block
- **Persistent Storage** — all courses saved to MongoDB
- **Dark editorial UI** — Playfair Display + Source Serif 4 typography

---

## 🗂 Project Structure

```
text-to-learn/
├── server/               ← Node.js + Express backend
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── Course.js
│   │   ├── Module.js
│   │   └── Lesson.js
│   ├── routes/
│   │   ├── courseRoutes.js
│   │   └── lessonRoutes.js
│   ├── controllers/
│   │   ├── courseController.js
│   │   └── lessonController.js
│   ├── services/
│   │   └── aiService.js      ← Claude API calls
│   ├── middlewares/
│   │   └── errorHandler.js
│   └── .env.example
│
└── client/               ← React + Vite + Tailwind frontend
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── utils/api.js
        ├── pages/
        │   ├── Home.jsx
        │   ├── CoursePage.jsx
        │   └── LessonPage.jsx
        └── components/
            ├── LessonRenderer.jsx
            └── blocks/
                ├── HeadingBlock.jsx
                ├── ParagraphBlock.jsx
                ├── CodeBlock.jsx
                ├── VideoBlock.jsx
                └── MCQBlock.jsx
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v18+ |
| MongoDB | local or Atlas |
| Anthropic API Key | [console.anthropic.com](https://console.anthropic.com) |

---

### Step 1 — Backend setup

```bash
cd text-to-learn/server

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/text-to-learn
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
```

> **MongoDB Atlas (free cloud):** create a cluster at https://cloud.mongodb.com,
> then replace `MONGO_URI` with your Atlas connection string.

```bash
# Start the backend (with auto-reload)
npm run dev
# ✅  Server running on http://localhost:5000
```

---

### Step 2 — Frontend setup

Open a **new terminal**:

```bash
cd text-to-learn/client

# Install dependencies
npm install

# Start the dev server
npm run dev
# ✅  Frontend at http://localhost:5173
```

Vite proxies `/api/*` → `http://localhost:5000` automatically — no CORS issues.

---

### Step 3 — Use the app

1. Open **http://localhost:5173**
2. Type a topic e.g. `"Intro to TypeScript"` and click **Generate Course**
3. Wait ~15-30 seconds for Claude to design the curriculum
4. You'll be taken to the Course page — click any lesson
5. Click **✨ Generate Lesson** to create rich content (headings, code, quizzes…)
6. Answer the MCQ quizzes inline
7. Click **↓ PDF** to download the lesson as a PDF

---

## 🌐 Deployment

### Backend → Render

1. Push `server/` folder to GitHub
2. Create a **Web Service** on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables in the Render dashboard

### Frontend → Vercel

1. Push `client/` folder to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add env variable: `VITE_API_URL=https://your-render-url.onrender.com`
4. In `client/src/utils/api.js` change baseURL to:
   ```js
   baseURL: import.meta.env.VITE_API_URL + "/api"
   ```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/courses/generate` | Generate a new course from a topic |
| `GET`  | `/api/courses` | List all saved courses |
| `GET`  | `/api/courses/:id` | Get a single course with modules |
| `DELETE` | `/api/courses/:id` | Delete a course and all its data |
| `GET`  | `/api/lessons/:id` | Get a single lesson |
| `POST` | `/api/lessons/:id/generate` | Generate rich content for a lesson |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| AI | Anthropic Claude (claude-sonnet-4) |
| Syntax highlighting | react-syntax-highlighter |
| PDF export | jsPDF + html2canvas |
| Fonts | Playfair Display, Source Serif 4, JetBrains Mono |
