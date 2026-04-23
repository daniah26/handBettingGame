//mongoDB schema

import mongoose from 'mongoose';

const tileSchema = new mongoose.Schema(
  {
    label: String,
    type: {
      type: String,
      enum: ['number', 'wind', 'dragon']
    },
    value: Number,
    suit: String
  },
  { _id: false }
);

const handSchema = new mongoose.Schema(
  {
    tiles: [tileSchema],
    totalValue: Number
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    round: Number,
    result: String,
    total: Number,
    tiles: [tileSchema]
  },
  { _id: false }
);

const gameSchema = new mongoose.Schema(
  {
    score: { type: Number, default: 0 },
    roundsPlayed: { type: Number, default: 0 },
    drawPile: [tileSchema],
    discardPile: [tileSchema],
    drawPileEmptyCount: { type: Number, default: 0 },

    previousHand: handSchema,
    currentHand: handSchema,

    tileValues: {
      eastWind: { type: Number, default: 5 },
      southWind: { type: Number, default: 5 },
      westWind: { type: Number, default: 5 },
      northWind: { type: Number, default: 5 },
      redDragon: { type: Number, default: 5 },
      greenDragon: { type: Number, default: 5 },
      whiteDragon: { type: Number, default: 5 }
    },

    lastBet: {
      type: String,
      enum: ['Higher', 'Lower', null],
      default: null
    },
    lastResult: {
      type: String,
      enum: ['Higher', 'Lower', 'Tie', null],
      default: null
    },
    betCorrect: { type: Boolean, default: false },

    history: [historySchema],

    gameOver: { type: Boolean, default: false },
    gameOverReason: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Game', gameSchema);