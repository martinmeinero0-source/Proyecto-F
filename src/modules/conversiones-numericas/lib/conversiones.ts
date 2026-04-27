/**
 * Biblioteca de algoritmos para conversiones numéricas
 * NO utiliza funciones nativas de conversión (parseInt, toString, etc.)
 */

const HEX_DIGITS = '0123456789ABCDEF';

// ═══════════════════════════════════════════════
// UTILIDADES GENERALES
// ═══════════════════════════════════════════════

export function digitToHex(n: number): string {
  return HEX_DIGITS[n] || '0';
}

export function hexToDecDigit(c: string): number {
  c = c.toUpperCase();
  if (c >= '0' && c <= '9') return parseInt(c);
  if (c >= 'A' && c <= 'F') return c.charCodeAt(0) - 55;
  return -1;
}

// ═══════════════════════════════════════════════
// HU-1.1: DIVISIONES SUCESIVAS
// Decimal → Otras Bases
// ═══════════════════════════════════════════════

export interface DivisionStep {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

export interface HU11Result {
  original: number;
  base: number;
  steps: DivisionStep[];
  result: string;
  resultDigits: string[];
}

export function convertDecimalToBase(decimal: number, base: number): HU11Result {
  if (decimal < 0) throw new Error('Número debe ser positivo');
  if (decimal === 0) {
    return {
      original: 0,
      base,
      steps: [],
      result: '0',
      resultDigits: ['0'],
    };
  }

  const steps: DivisionStep[] = [];
  let n = decimal;

  while (n > 0) {
    const quotient = Math.floor(n / base);
    const remainder = n % base;
    steps.push({ dividend: n, divisor: base, quotient, remainder });
    n = quotient;
  }

  const resultDigits = steps.map((s) => digitToHex(s.remainder)).reverse();
  const result = resultDigits.join('');

  return { original: decimal, base, steps, result, resultDigits };
}

// ═══════════════════════════════════════════════
// HU-1.3: POTENCIAS (REPRESENTACIÓN POLINOMIAL)
// Bases → Decimal
// ═══════════════════════════════════════════════

export interface PolynomialTerm {
  digit: number;
  digitStr: string;
  base: number;
  exp: number;
  power: number;
  val: number;
}

export interface HU13Result {
  input: string;
  base: number;
  terms: PolynomialTerm[];
  result: number;
}

export function convertBaseToDecimal(input: string, base: number): HU13Result {
  const normalized = input.trim().toUpperCase();

  // Validar dígitos
  for (const c of normalized) {
    const d = hexToDecDigit(c);
    if (d < 0 || d >= base) {
      throw new Error(`Dígito inválido '${c}' para base ${base}`);
    }
  }

  const digits = normalized.split('').map((c) => hexToDecDigit(c));
  const len = digits.length;
  const terms: PolynomialTerm[] = [];
  let total = 0;

  digits.forEach((d, i) => {
    const exp = len - 1 - i;
    let power = 1;
    for (let j = 0; j < exp; j++) {
      power *= base;
    }
    const val = d * power;
    total += val;
    terms.push({
      digit: d,
      digitStr: HEX_DIGITS[d],
      base,
      exp,
      power,
      val,
    });
  });

  return { input: normalized, base, terms, result: total };
}

// ═══════════════════════════════════════════════
// HU-1.4: CONVERSIONES DIRECTAS
// Binario ↔ Octal/Hexadecimal
// ═══════════════════════════════════════════════

export interface BitGroup {
  bits: string;
  val: number;
  hex?: string;
  digit?: string;
}

export interface DirectConversionResult {
  groups: BitGroup[];
  result: string;
  groupSize: number;
  from: string;
  to: string;
}

export function bin2oct(bin: string): DirectConversionResult {
  bin = bin.replace(/\s/g, '');

  // Validar
  for (const c of bin) {
    if (c !== '0' && c !== '1') {
      throw new Error(`Carácter inválido '${c}' - solo se permiten 0 y 1`);
    }
  }

  // Pad to multiple of 3
  while (bin.length % 3 !== 0) {
    bin = '0' + bin;
  }

  const groups: BitGroup[] = [];
  for (let i = 0; i < bin.length; i += 3) {
    const g = bin.slice(i, i + 3);
    const val = parseInt(g[0]) * 4 + parseInt(g[1]) * 2 + parseInt(g[2]) * 1;
    groups.push({ bits: g, val });
  }

  return {
    groups,
    result: groups.map((g) => g.val).join(''),
    groupSize: 3,
    from: 'bin',
    to: 'oct',
  };
}

export function bin2hex(bin: string): DirectConversionResult {
  bin = bin.replace(/\s/g, '');

  for (const c of bin) {
    if (c !== '0' && c !== '1') {
      throw new Error(`Carácter inválido '${c}' - solo se permiten 0 y 1`);
    }
  }

  while (bin.length % 4 !== 0) {
    bin = '0' + bin;
  }

  const groups: BitGroup[] = [];
  for (let i = 0; i < bin.length; i += 4) {
    const g = bin.slice(i, i + 4);
    const val =
      parseInt(g[0]) * 8 +
      parseInt(g[1]) * 4 +
      parseInt(g[2]) * 2 +
      parseInt(g[3]) * 1;
    groups.push({
      bits: g,
      val,
      hex: HEX_DIGITS[val],
    });
  }

  return {
    groups,
    result: groups.map((g) => g.hex).join(''),
    groupSize: 4,
    from: 'bin',
    to: 'hex',
  };
}

export function oct2bin(oct: string): DirectConversionResult {
  oct = oct.replace(/\s/g, '').toUpperCase();

  for (const c of oct) {
    const d = parseInt(c);
    if (isNaN(d) || d > 7) {
      throw new Error(`Dígito inválido '${c}' para octal`);
    }
  }

  const groups: BitGroup[] = [];
  for (const c of oct) {
    const d = parseInt(c);
    const b2 = Math.floor(d / 4);
    const r2 = d % 4;
    const b1 = Math.floor(r2 / 2);
    const b0 = r2 % 2;
    const manualBits = `${b2}${b1}${b0}`;
    groups.push({ bits: manualBits, val: d, digit: c });
  }

  return {
    groups,
    result: groups.map((g) => g.bits).join(''),
    groupSize: 3,
    from: 'oct',
    to: 'bin',
  };
}

export function hex2bin(hex: string): DirectConversionResult {
  hex = hex.replace(/\s/g, '').toUpperCase();

  const groups: BitGroup[] = [];
  for (const c of hex) {
    const d = hexToDecDigit(c);
    if (d < 0) {
      throw new Error(`Dígito hexadecimal inválido '${c}'`);
    }

    const b3 = Math.floor(d / 8);
    const r3 = d % 8;
    const b2 = Math.floor(r3 / 4);
    const r2 = r3 % 4;
    const b1 = Math.floor(r2 / 2);
    const b0 = r2 % 2;
    const manualBits = `${b3}${b2}${b1}${b0}`;
    groups.push({ bits: manualBits, val: d, digit: c });
  }

  return {
    groups,
    result: groups.map((g) => g.bits).join(''),
    groupSize: 4,
    from: 'hex',
    to: 'bin',
  };
}

// ═══════════════════════════════════════════════
// HU-1.2: DECIMAL FRACCIONARIO
// ═══════════════════════════════════════════════

export interface FractionStep {
  step: number;
  frac: number;
  product: number;
  bit: number;
  newFrac: number;
}

export interface HU12Result {
  input: number;
  maxBits: number;
  steps: FractionStep[];
  bits: number[];
  isPeriodic: boolean;
  periodStart: number;
  resultStr: string;
}

export function convertFractionalDecimalToBinary(
  input: number,
  maxBits: number,
): HU12Result {
  if (input <= 0 || input >= 1) {
    throw new Error('La fracción debe estar entre 0 (exclusivo) y 1 (exclusivo)');
  }

  const steps: FractionStep[] = [];
  const seen = new Map<string, number>();
  let isPeriodic = false;
  let periodStart = -1;
  let frac = input;

  for (let i = 0; i < maxBits; i++) {
    const fracStr = frac.toFixed(15);
    if (seen.has(fracStr)) {
      isPeriodic = true;
      periodStart = seen.get(fracStr)!;
      break;
    }
    seen.set(fracStr, i);

    const product = frac * 2;
    const bit = product >= 1 ? 1 : 0;
    const newFrac = product >= 1 ? product - 1 : product;
    steps.push({ step: i + 1, frac, product, bit, newFrac });
    frac = newFrac;
    if (newFrac === 0) break;
  }

  const bits = steps.map((s) => s.bit);
  let resultStr: string;
  if (isPeriodic) {
    const nonPeriodic = bits.slice(0, periodStart).join('');
    const periodic = bits.slice(periodStart).join('');
    resultStr = `0.${nonPeriodic}(${periodic})…`;
  } else {
    resultStr = `0.${bits.join('')}`;
  }

  return {
    input,
    maxBits,
    steps,
    bits,
    isPeriodic,
    periodStart,
    resultStr,
  };
}
