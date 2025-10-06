// Glicko-2 Rating System Implementation
// Based on: http://www.glicko.net/glicko/glicko2.pdf

const TAU = 0.5; // System constant (volatility change)
const EPSILON = 0.000001;

function g(phi: number): number {
  return 1 / Math.sqrt(1 + 3 * phi * phi / (Math.PI * Math.PI));
}

function E(mu: number, muJ: number, phiJ: number): number {
  return 1 / (1 + Math.exp(-g(phiJ) * (mu - muJ)));
}

function f(x: number, delta: number, phi: number, v: number, a: number): number {
  const ex = Math.exp(x);
  const phi2 = phi * phi;
  const num1 = ex * (delta * delta - phi2 - v - ex);
  const den1 = 2 * (phi2 + v + ex) * (phi2 + v + ex);
  const num2 = x - a;
  const den2 = TAU * TAU;
  return num1 / den1 - num2 / den2;
}

export interface GlickoRating {
  rating: number;
  deviation: number;
  volatility: number;
}

export function updateGlicko2(
  playerRating: GlickoRating,
  opponentRating: GlickoRating,
  outcome: number // 1 for win, 0 for loss
): GlickoRating {
  // Convert to Glicko-2 scale
  const mu = (playerRating.rating - 1500) / 173.7178;
  const phi = playerRating.deviation / 173.7178;
  const sigma = playerRating.volatility;
  
  const muJ = (opponentRating.rating - 1500) / 173.7178;
  const phiJ = opponentRating.deviation / 173.7178;

  // Step 3: Compute v (variance)
  const gPhiJ = g(phiJ);
  const EVal = E(mu, muJ, phiJ);
  const v = 1 / (gPhiJ * gPhiJ * EVal * (1 - EVal));

  // Step 4: Compute delta
  const delta = v * gPhiJ * (outcome - EVal);

  // Step 5: Determine new volatility
  const a = Math.log(sigma * sigma);
  let A = a;
  let B: number;
  
  if (delta * delta > phi * phi + v) {
    B = Math.log(delta * delta - phi * phi - v);
  } else {
    let k = 1;
    while (f(a - k * TAU, delta, phi, v, a) < 0) {
      k++;
    }
    B = a - k * TAU;
  }

  let fA = f(A, delta, phi, v, a);
  let fB = f(B, delta, phi, v, a);

  while (Math.abs(B - A) > EPSILON) {
    const C = A + (A - B) * fA / (fB - fA);
    const fC = f(C, delta, phi, v, a);

    if (fC * fB < 0) {
      A = B;
      fA = fB;
    } else {
      fA = fA / 2;
    }

    B = C;
    fB = fC;
  }

  const sigmaPrime = Math.exp(A / 2);

  // Step 6: Update rating deviation
  const phiStar = Math.sqrt(phi * phi + sigmaPrime * sigmaPrime);

  // Step 7: Update rating and RD
  const phiPrime = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
  const muPrime = mu + phiPrime * phiPrime * gPhiJ * (outcome - EVal);

  // Convert back to original scale
  return {
    rating: muPrime * 173.7178 + 1500,
    deviation: phiPrime * 173.7178,
    volatility: sigmaPrime,
  };
}
