// Tipos para el módulo de números signados

export interface SignedRepresentation {
  value: number
  nBits: number
  method: 'signo-magnitud' | 'complemento-1' | 'complemento-2' | 'exceso-k'
  binary: string
  range: {
    min: number
    max: number
  }
  hasDoublZero?: boolean
}

export interface ExcessoKConfig {
  k: number
  formula: string // 2^(n-1) - 1 o 2^(n-1)
}

export interface ComplementoResult extends SignedRepresentation {
  steps: {
    operation: string
    result: string
  }[]
}
