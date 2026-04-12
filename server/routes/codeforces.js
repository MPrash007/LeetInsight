import express from 'express';
import { getCodeforcesData } from '../controllers/codeforcesController.js';

const router = express.Router();

router.get('/codeforces/:username', getCodeforcesData);

export default router;
