# 🔍 LeetInsight — LeetCode Analytics Dashboard

A modern full-stack web app that analyzes any LeetCode user's profile and displays their coding journey through an interactive dashboard with charts, stats, and AI-powered insights.

![LeetCode Theme](https://img.shields.io/badge/theme-LeetCode%20Dark-FFA116?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

## ✨ Features

- **Profile Overview** — Avatar, ranking, contest rating, badges, contributions
- **Problem Stats** — Easy/Medium/Hard breakdown with animated progress bars
- **Difficulty Distribution** — Interactive donut pie chart
- **Topic Analysis** — Bar chart showing top 12 topic strengths
- **Contest Rating History** — Area chart tracking rating over time
- **Submission Heatmap** — GitHub-style activity calendar (last year)
- **AI Insights** — Rule-based performance analysis with strengths, weaknesses, and recommendations
- **Skeleton Loaders** — Smooth loading states with pulsing placeholders
- **Error Handling** — Graceful error UI for invalid usernames
- **Responsive Design** — Mobile-friendly layout

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Tailwind CSS 3, Recharts, Lucide React |
| Backend | Node.js, Express.js |
| API | LeetCode GraphQL API |
| Styling | LeetCode dark theme with glassmorphism cards |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/LeetInsight.git
cd LeetInsight

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running Locally

```bash
# Terminal 1 — Start the backend (port 5000)
cd server
node index.js

# Terminal 2 — Start the frontend (port 5173)
npm run dev
```

Open **http://localhost:5173** and search for any LeetCode username.

## 📁 Project Structure

```
LeetInsight/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── StatsCards.jsx
│   │   ├── DifficultyChart.jsx
│   │   ├── TopicChart.jsx
│   │   ├── ContestChart.jsx
│   │   ├── Heatmap.jsx
│   │   ├── AIInsightsCard.jsx
│   │   ├── SkeletonLoader.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── routes/user.js
│   ├── controllers/userController.js
│   ├── services/leetcodeService.js
│   └── index.js
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🎨 Design

- **Primary BG:** `#0F0F0F`
- **Card BG:** `#1A1A1A` with glassmorphism
- **Accent:** `#FFA116` (LeetCode Yellow)
- **Easy:** `#00B8A3` · **Medium:** `#FFC01E` · **Hard:** `#FF375F`

## 📄 License

MIT
