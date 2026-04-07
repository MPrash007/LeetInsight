import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';
import { getAiInsights } from './controllers/insightsController.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load .env from root directory

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.post('/api/insights', getAiInsights);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ LeetInsight server running on port ${PORT}`);
});
