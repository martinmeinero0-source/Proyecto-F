// Tipos para el módulo de conversiones numéricas

export interface ConversionStep {
  operation: string
  step: number
  result: string
  remainder?: number | string
}

export interface ConversionResult {
  original: number | string
  originalBase: number
  targetBase: number
  result: string
  steps: ConversionStep[]
  method: 'divisiones_sucesivas' | 'multiplicaciones_sucesivas' | 'potencias' | 'directa'
}

export interface FractionalConversionResult extends ConversionResult {
  precision: number
  isPeriodic: boolean
  period?: string
}

export interface NumericBase {
  base: number
  name: string
  digits: string
  symbols?: Record<number, string>
}

export const NUMERIC_BASES: Record<number, NumericBase> = {
  2: {
    base: 2,
    name: 'Binario',
    digits: '01',
  },
  8: {
    base: 8,
    name: 'Octal',
    digits: '01234567',
  },
  10: {
    base: 10,
    name: 'Decimal',
    digits: '0123456789',
  },
  16: {
    base: 16,
    name: 'Hexadecimal',
    digits: '0123456789ABCDEF',
    symbols: {
      10: 'A',
      11: 'B',
      12: 'C',
      13: 'D',
      14: 'E',
      15: 'F',
    },
  },
}
