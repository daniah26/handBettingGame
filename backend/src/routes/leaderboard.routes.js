import express from 'express';
import { getTopScores } from '../controllers/game.controller.js';

const router = express.Router();

router.get('/', getTopScores);

export default router;