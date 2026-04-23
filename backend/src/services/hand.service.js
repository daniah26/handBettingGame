export const getTileDynamicValue = (tile, tileValues) => {
  if (tile.type === 'number') return tile.value;

  const map = {
    East: tileValues.eastWind,
    South: tileValues.southWind,
    West: tileValues.westWind,
    North: tileValues.northWind,
    Red: tileValues.redDragon,
    Green: tileValues.greenDragon,
    White: tileValues.whiteDragon
  };

  return map[tile.label];
};

export const calculateHandValue = (tiles, tileValues) => {
  const totalValue = tiles.reduce((sum, tile) => {
    return sum + getTileDynamicValue(tile, tileValues);
  }, 0);

  const resolvedTiles = tiles.map((tile) => ({
    ...tile,
    value: getTileDynamicValue(tile, tileValues)
  }));

  return {
    tiles: resolvedTiles,
    totalValue
  };
};

export const compareHands = (previousTotal, currentTotal) => {
  if (currentTotal > previousTotal) return 'Higher';
  if (currentTotal < previousTotal) return 'Lower';
  return 'Tie';
};