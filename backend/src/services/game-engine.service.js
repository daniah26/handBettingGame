import Game from '../models/Game.js';
import { createFreshDeck, shuffleDeck, drawTiles } from './deck.service.js';
import { calculateHandValue, compareHands } from './hand.service.js';
import { updateTileValues, checkTileValueLimits } from './tile-value.service.js';

const HAND_SIZE = 3;

export const startNewGame = async () => {
  const deck = shuffleDeck(createFreshDeck());

  const firstDraw = drawTiles(deck, HAND_SIZE);
  const defaultTileValues = {
    eastWind: 5,
    southWind: 5,
    westWind: 5,
    northWind: 5,
    redDragon: 5,
    greenDragon: 5,
    whiteDragon: 5
  };

  const previousHand = calculateHandValue(firstDraw.drawn, defaultTileValues);

  const game = await Game.create({
    score: 0,
    roundsPlayed: 0,
    drawPile: firstDraw.remaining,
    discardPile: [],
    drawPileEmptyCount: 0,
    previousHand,
    currentHand: null,
    tileValues: defaultTileValues,
    history: [],
    gameOver: false
  });

  return game;
};

export const playRound = async (gameId, betChoice) => {
  const game = await Game.findById(gameId);

  if (!game) {
    throw new Error('Game not found');
  }

  if (game.gameOver) {
    throw new Error('Game is already over');
  }

  let drawPile = [...game.drawPile];
  let discardPile = [...game.discardPile];
  let drawPileEmptyCount = game.drawPileEmptyCount;

  if (drawPile.length < HAND_SIZE) {
    drawPileEmptyCount += 1;

    if (drawPileEmptyCount >= 3) {
      game.gameOver = true;
      game.gameOverReason = 'Draw pile ran out for the 3rd time';
      await game.save();
      return game;
    }

    const newDeck = createFreshDeck();
    drawPile = shuffleDeck([...discardPile, ...newDeck]);
    discardPile = [];
  }

  const drawResult = drawTiles(drawPile, HAND_SIZE);
  drawPile = drawResult.remaining;

  const currentHand = calculateHandValue(drawResult.drawn, game.tileValues);
  const result = compareHands(game.previousHand.totalValue, currentHand.totalValue);
  const betCorrect = betChoice === result;

  if (betCorrect) {
    game.score += 1;
  }

  let winningHandTiles = [];
  let losingHandTiles = [];

  if (result === 'Higher') {
    winningHandTiles = currentHand.tiles;
    losingHandTiles = game.previousHand.tiles;
  } else if (result === 'Lower') {
    winningHandTiles = game.previousHand.tiles;
    losingHandTiles = currentHand.tiles;
  }

  if (result !== 'Tie') {
    game.tileValues = updateTileValues(game.tileValues, winningHandTiles, losingHandTiles);
  }

  const limitCheck = checkTileValueLimits(game.tileValues);
  if (limitCheck.gameOver) {
    game.gameOver = true;
    game.gameOverReason = limitCheck.reason;
  }

  game.history.unshift({
    round: game.roundsPlayed + 1,
    result,
    total: game.previousHand.totalValue,
    tiles: game.previousHand.tiles
  });

  discardPile.push(...game.previousHand.tiles);

  game.roundsPlayed += 1;
  game.lastBet = betChoice;
  game.lastResult = result;
  game.betCorrect = betCorrect;
  game.currentHand = currentHand;
  game.previousHand = currentHand;
  game.drawPile = drawPile;
  game.discardPile = discardPile;
  game.drawPileEmptyCount = drawPileEmptyCount;

  await game.save();
  return game;
};

export const getLeaderboard = async () => {
  return Game.find({ gameOver: true })
    .sort({ score: -1, createdAt: -1 })
    .limit(5)
    .select('score createdAt');
};