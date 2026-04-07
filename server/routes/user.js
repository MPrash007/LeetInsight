import express from 'express';
import { getUserData } from '../controllers/userController.js';

const router = express.Router();

router.get('/user/:username', getUserData);

export default router;
