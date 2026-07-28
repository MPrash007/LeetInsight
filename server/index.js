import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';
import codeforcesRoutes from './routes/codeforces.js';
import { getAiInsights } from './controllers/insightsController.js';
import config from './config/index.js';

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', codeforcesRoutes);
app.post('/api/insights', getAiInsights);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ LeetInsight server running on port ${PORT}`);
});
