// Tipos para el módulo de álgebra booleana

export interface TruthTableRow {
  inputs: Record<string, boolean>
  output: boolean
}

export type LogicalGate = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR'

export interface BooleanExpression {
  variables: string[]
  expression: string
  truthTable: TruthTableRow[]
}

export interface CanonicalForm {
  type: 'SOP' | 'POS' // Sum of Products / Product of Sums
  minterms?: number[]
  maxterms?: number[]
  notation: string // Σm(1,3,5) o ΠM(0,2,4)
}

export interface KarnaughMap {
  variables: number
  rows: number
  cols: number
  grid: (boolean | 'X')[][]
  grouping?: KarnaughGroup[]
}

export interface KarnaughGroup {
  cells: [number, number][] // Pares de índices
  type: 'implicante' | 'implicante-esencial'
  term: string
}

export interface ImplicantData {
  binary: string
  minterms: number[]
  isEssential: boolean
  isPrime: boolean
}
