const getTileKey = (label) => {
  const map = {
    East: 'eastWind',
    South: 'southWind',
    West: 'westWind',
    North: 'northWind',
    Red: 'redDragon',
    Green: 'greenDragon',
    White: 'whiteDragon'
  };

  return map[label];
};

export const updateTileValues = (tileValues, winningTiles, losingTiles) => {
  const updated = { ...tileValues };

  for (const tile of winningTiles) {
    if (tile.type !== 'number') {
      const key = getTileKey(tile.label);
      updated[key] += 1;
    }
  }

  for (const tile of losingTiles) {
    if (tile.type !== 'number') {
      const key = getTileKey(tile.label);
      updated[key] -= 1;
    }
  }

  return updated;
};

export const checkTileValueLimits = (tileValues) => {
  for (const [key, value] of Object.entries(tileValues)) {
    if (value <= 0) {
      return { gameOver: true, reason: `${key} reached 0` };
    }
    if (value >= 10) {
      return { gameOver: true, reason: `${key} reached 10` };
    }
  }

  return { gameOver: false, reason: null };
};