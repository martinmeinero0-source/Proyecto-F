// Tipos para el módulo de códigos y errores

export interface CodeConversion {
  input: string | number
  output: string
  code: CodeType
  steps?: string[]
}

export type CodeType = 'BCD' | 'GRAY' | 'ASCII' | 'UTF-16' | 'HAMMING' | 'CRC'

export interface ParityCheck {
  data: string
  parity: 'PAR' | 'IMPAR'
  parityBit: 0 | 1
  isValid: boolean
  errorPosition?: number
}

export interface HammingCode {
  data: string
  encoded: string
  parityBits: Map<number, boolean> // Posiciones de potencias de 2
  steps: HammingStep[]
}

export interface HammingStep {
  position: number
  bits: string[]
  calculation: string
  result: boolean
}

export interface CRCValidation {
  data: string
  polynomial: string
  remainder: string
  isValid: boolean
  steps: CRCStep[]
}

export interface CRCStep {
  step: number
  dividend: string
  divisor: string
  quotient: string
  remainder: string
}
