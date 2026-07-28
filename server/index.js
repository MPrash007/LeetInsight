import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';
import codeforcesRoutes from './routes/codeforces.js';
import { getAiInsights } from './controllers/insightsController.js';
import config from './config/index.js';

const app = express();

app.use(cors());
app.use(express.json());

// Support routes with or without /api prefix for local and serverless environments
app.use('/api', userRoutes);
app.use('/api', codeforcesRoutes);
app.use('/user', userRoutes);
app.use('/codeforces', codeforcesRoutes);
app.post('/api/insights', getAiInsights);
app.post('/insights', getAiInsights);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = config.port;
    app.listen(PORT, () => {
        console.log(`✅ LeetInsight server running on port ${PORT}`);
    });
}
