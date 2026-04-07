# 🚀 LeetInsight — LeetCode Analytics Dashboard

**Live Demo:** [https://leet-insight-r61a.vercel.app/](https://leet-insight-r61a.vercel.app/)

A modern, full-stack web application that fetches any LeetCode user's data and visualizes their coding journey. It features a beautiful stunning UI, interactive charts, and AI-driven performance insights.

![Theme](https://img.shields.io/badge/theme-Deep%20Navy%20%26%20Neon-7C5CFC?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?style=for-the-badge&logo=vercel)

## ✨ Features

- **Profile Overview:** Global ranking, contest rating, badges, and contribution points.
- **Problem Stats:** Difficulty breakdown with gradient animated progress bars.
- **Difficulty Distribution:** Interactive donut chart (Recharts).
- **Topic Analysis:** Neon-style bar chart tracking top 15 highest-solved problem tags.
- **Contest History:** Area chart tracking contest rating progression over time.
- **Submission Heatmap:** GitHub-style continuous activity calendar covering the last 365 days.
- **AI Insights:** Rule-based performance analysis highlighting strengths, weaknesses, and personalized problem recommendations.
- **Robust Error Handling:** Sequential API request handling to bypass strict Cloudflare/rate-limit blocks, complete with user-friendly error UI.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, Recharts, Lucide React icons |
| **Backend** | Vercel Serverless Functions (`api/` directory) & standalone Express.js for local dev |
| **Data Source** | LeetCode GraphQL API |
| **Deployment** | Vercel |

## 🎨 Theme Details (Maxton Style)

The application utilizes a custom **Deep Navy & Neon** color palette:
- **Backgrounds:** `#0B0F19` (main) and `#151929` (glassmorphism cards)
- **Primary Accent:** `#7C5CFC` (Purple)
- **Secondary Accents:** `#00D4FF` (Cyan), `#E91E8C` (Pink), `#FF6B35` (Orange)
- **UI Elements:** Subtle gradient text, translucent glass borders, and smooth micro-animations.

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MPrash007/LeetInsight.git
cd LeetInsight

# Install frontend dependencies
npm install

# Install local backend dependencies
cd server
npm install
cd ..
```

### Running Locally

```bash
# Terminal 1 — Start the local Express backend (port 5000)
cd server
node index.js

# Terminal 2 — Start the Vite frontend (port 5173)
npm run dev
```

Open **http://localhost:5173** and search for a username!

## 🌐 Vercel Deployment

The project is fully configured for Vercel. Because LeetCode's API aggressively blocks concurrent requests from datacenter IPs, the Vercel branch uses **Serverless Functions** (located in `/api`) that query the endpoints sequentially with randomized delays.

1. Import your GitHub repository to Vercel.
2. Vercel automatically detects the **Vite** preset.
3. Click **Deploy**. The `/api/user.js` handles all data fetching natively on the edge!

## 📁 Project Structure

```
LeetInsight/
├── api/                     # Vercel Serverless Functions
│   ├── _lib/                # Shared logic (LeetCode GraphQL queries)
│   └── user.js              # Serverless API endpoint
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components & Charts
│   ├── pages/               # Home and Dashboard views
│   ├── services/            # Frontend API client (Axios)
│   ├── App.jsx              
│   ├── main.jsx             
│   └── index.css            # Global styles and tailwind utilities
├── server/                  # Local development Express server
├── tailwind.config.js       # Design tokens and custom theme
├── vercel.json              # Vercel routing configuration
└── package.json             
```

## 📄 License

MIT
