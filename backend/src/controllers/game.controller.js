import { startNewGame, playRound, getLeaderboard } from '../services/game-engine.service.js';
import Game from '../models/Game.js';

export const startGame = async (req, res) => {
  try {
    const game = await startNewGame();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const makeBet = async (req, res) => {
  try {
    const { gameId, betChoice } = req.body;
    const game = await playRound(gameId, betChoice);
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopScores = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};