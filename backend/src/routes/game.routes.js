import express from 'express';
import { startGame, makeBet, getGameById } from '../controllers/game.controller.js';

const router = express.Router();

router.post('/start', startGame);
router.post('/bet', makeBet);
router.get('/:id', getGameById);

export default router;