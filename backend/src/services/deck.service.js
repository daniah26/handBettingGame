export const createFreshDeck = () => {
  const deck = [];

  const suits = ['dots', 'bamboo', 'characters'];
  const winds = ['East', 'South', 'West', 'North'];
  const dragons = ['Red', 'Green', 'White'];

  for (const suit of suits) {
    for (let i = 1; i <= 9; i++) {
      for (let copy = 0; copy < 4; copy++) {
        deck.push({
          label: String(i),
          type: 'number',
          value: i,
          suit
        });
      }
    }
  }

  for (const wind of winds) {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        label: wind,
        type: 'wind',
        value: 5
      });
    }
  }

  for (const dragon of dragons) {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        label: dragon,
        type: 'dragon',
        value: 5
      });
    }
  }

  return deck;
};

export const shuffleDeck = (deck) => {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const drawTiles = (drawPile, count) => {
  const drawn = drawPile.slice(0, count);
  const remaining = drawPile.slice(count);

  return {
    drawn,
    remaining
  };
};