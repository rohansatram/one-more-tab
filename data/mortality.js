// Annual probability of dying q(x) by age, both sexes combined.
// Source: CDC National Center for Health Statistics, "United States Life Tables, 2023"
// Values at 5-year intervals are from CDC Table 1; intermediate years are interpolated.
const ANNUAL_DEATH_PROBABILITY_BY_AGE = [
  0.005574, // age 0
  0.000392, // age 1
  0.000350, // age 2 (interpolated)
  0.000300, // age 3 (interpolated)
  0.000220, // age 4 (interpolated)
  0.000155, // age 5
  0.000143, // age 6
  0.000132, // age 7
  0.000120, // age 8
  0.000108, // age 9
  0.000097, // age 10
  0.000110, // age 11
  0.000130, // age 12
  0.000160, // age 13
  0.000220, // age 14
  0.000300, // age 15
  0.000370, // age 16
  0.000440, // age 17
  0.000510, // age 18
  0.000590, // age 19
  0.000679, // age 20
  0.000730, // age 21
  0.000770, // age 22
  0.000820, // age 23
  0.000900, // age 24
  0.000995, // age 25
  0.001030, // age 26
  0.001060, // age 27
  0.001100, // age 28
  0.001180, // age 29
  0.001275, // age 30
  0.001310, // age 31
  0.001350, // age 32
  0.001390, // age 33
  0.001490, // age 34
  0.001601, // age 35
  0.001700, // age 36
  0.001810, // age 37
  0.001930, // age 38
  0.002050, // age 39
  0.002166, // age 40
  0.002360, // age 41
  0.002550, // age 42
  0.002750, // age 43
  0.002960, // age 44
  0.003180, // age 45
  0.003500, // age 46
  0.003830, // age 47
  0.004170, // age 48
  0.004540, // age 49
  0.004944, // age 50
  0.005440, // age 51
  0.005980, // age 52
  0.006570, // age 53
  0.007030, // age 54
  0.007559, // age 55
  0.008280, // age 56
  0.009040, // age 57
  0.009850, // age 58
  0.010520, // age 59
  0.011246, // age 60
  0.012100, // age 61
  0.013020, // age 62
  0.013990, // age 63
  0.014950, // age 64
  0.015949, // age 65
  0.017400, // age 66
  0.018950, // age 67
  0.020600, // age 68
  0.021900, // age 69
  0.023247, // age 70
  0.025500, // age 71
  0.027900, // age 72
  0.029800, // age 73
  0.032100, // age 74
  0.034789, // age 75
  0.038600, // age 76
  0.042200, // age 77
  0.046100, // age 78
  0.050000, // age 79
  0.054366, // age 80
  0.061000, // age 81
  0.068000, // age 82
  0.075500, // age 83
  0.082500, // age 84
  0.089851, // age 85
  0.101000, // age 86
  0.113000, // age 87
  0.126000, // age 88
  0.137500, // age 89
  0.149174, // age 90
  0.166000, // age 91
  0.183000, // age 92
  0.201000, // age 93
  0.219000, // age 94
  0.236687, // age 95
  0.260000, // age 96
  0.285000, // age 97
  0.310000, // age 98
  0.332000, // age 99
  0.354054, // age 100
];

// Returns the annual probability of dying for a given age.
// Caps at age 100 for ages beyond the table.
function getAnnualDeathProbability(age) {
  if (age < 0) return 0;
  if (age >= ANNUAL_DEATH_PROBABILITY_BY_AGE.length) {
    return ANNUAL_DEATH_PROBABILITY_BY_AGE[ANNUAL_DEATH_PROBABILITY_BY_AGE.length - 1];
  }
  return ANNUAL_DEATH_PROBABILITY_BY_AGE[age];
}

// Calculates the cumulative probability of dying before reaching a target age,
// given the person's current age. Uses the chain rule of survival probabilities.
function calculateDeathProbabilityBeforeAge(currentAge, targetAge) {
  if (targetAge <= currentAge) return 0;

  let survivalProbability = 1.0;
  for (let age = currentAge; age < targetAge; age++) {
    survivalProbability *= (1 - getAnnualDeathProbability(age));
  }

  return 1 - survivalProbability;
}
