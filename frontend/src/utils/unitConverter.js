const conversions = {
  kg: {
    lb: 2.20462,
    g: 1000,
    oz: 35.274
  },
  lb: {
    kg: 0.453592,
    g: 453.592,
    oz: 16
  },
  g: {
    kg: 0.001,
    lb: 0.00220462,
    oz: 0.035274
  },
  oz: {
    kg: 0.0283495,
    lb: 0.0625,
    g: 28.3495
  }
};

export const convertUnit = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  return value * conversions[fromUnit][toUnit];
};

export const standardizePrice = (price, portion, targetUnit = 'kg') => {
  return {
    price: price / convertUnit(1, portion, targetUnit),
    unit: targetUnit
  };
}; 