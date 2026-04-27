'use client'

import { useState } from 'react'

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR' | 'BUFFER'

interface GateInfo {
  name: GateType
  symbol: string
  minInputs: number
  maxInputs: number
  description: string
}

const GATES: GateInfo[] = [
  { name: 'AND',    symbol: '&',   minInputs: 2, maxInputs: 4, description: 'Salida 1 solo si TODAS las entradas son 1' },
  { name: 'OR',     symbol: '≥1',  minInputs: 2, maxInputs: 4, description: 'Salida 1 si AL MENOS UNA entrada es 1' },
  { name: 'NOT',    symbol: '1',   minInputs: 1, maxInputs: 1, description: 'Invierte la entrada (complemento)' },
  { name: 'BUFFER', symbol: '1',   minInputs: 1, maxInputs: 1, description: 'Repite la entrada sin modificar' },
  { name: 'XOR',    symbol: '=1',  minInputs: 2, maxInputs: 4, description: 'Salida 1 si número IMPAR de entradas son 1' },
  { name: 'NAND',   symbol: '&̄',  minInputs: 2, maxInputs: 4, description: 'NOT AND — Salida 0 solo si TODAS las entradas son 1' },
  { name: 'NOR',    symbol: '≥1̄', minInputs: 2, maxInputs: 4, description: 'NOT OR — Salida 0 si AL MENOS UNA entrada es 1' },
  { name: 'XNOR',   symbol: '=1̄', minInputs: 2, maxInputs: 4, description: 'NOT XOR — Salida 1 si número PAR de entradas son 1' },
]

function evaluateGate(gate: GateType, inputs: number[]): number {
  switch (gate) {
    case 'AND':    return inputs.every(i => i === 1) ? 1 : 0
    case 'OR':     return inputs.some(i => i === 1) ? 1 : 0
    case 'NOT':    return inputs[0] === 0 ? 1 : 0
    case 'BUFFER': return inputs[0]
    case 'XOR':    return inputs.reduce((acc, i) => acc ^ i, 0)
    case 'NAND':   return inputs.every(i => i === 1) ? 0 : 1
    case 'NOR':    return inputs.some(i => i === 1) ? 0 : 1
    case 'XNOR':   return inputs.reduce((acc, i) => acc ^ i, 0) === 0 ? 1 : 0
  }
}

function explainRow(gate: GateType, inputs: number[], labels: string[]): string {
  const pairs = inputs.map((v, i) => `${labels[i]}=${v}`).join(', ')
  const ones = inputs.filter(i => i === 1).length
  switch (gate) {
    case 'AND':
      return inputs.every(i => i === 1)
        ? `${pairs} → todas son 1 → F=1`
        : `${pairs} → hay ${inputs.filter(i => i === 0).length} entrada(s) en 0 → F=0`
    case 'OR':
      return inputs.some(i => i === 1)
        ? `${pairs} → al menos una es 1 → F=1`
        : `${pairs} → todas son 0 → F=0`
    case 'NOT':
      return inputs[0] === 0 ? `A=0 → complemento → F=1` : `A=1 → complemento → F=0`
    case 'BUFFER':
      return `A=${inputs[0]} → sin cambio → F=${inputs[0]}`
    case 'XOR':
      return `${pairs} → ${ones} uno(s) → número ${ones % 2 === 1 ? 'impar' : 'par'} → F=${ones % 2}`
    case 'NAND':
      return inputs.every(i => i === 1)
        ? `${pairs} → AND=1 → NOT(1) → F=0`
        : `${pairs} → AND=0 → NOT(0) → F=1`
    case 'NOR':
      return inputs.some(i => i === 1)
        ? `${pairs} → OR=1 → NOT(1) → F=0`
        : `${pairs} → OR=0 → NOT(0) → F=1`
    case 'XNOR':
      return `${pairs} → XOR=${ones % 2} → NOT(${ones % 2}) → F=${ones % 2 === 0 ? 1 : 0}`
  }
}

function buildTruthTable(gate: GateType, n: number): { inputs: number[]; output: number }[] {
  const rows: { inputs: number[]; output: number }[] = []
  const total = Math.pow(2, n)
  for (let i = 0; i < total; i++) {
    const inputs: number[] = []
    for (let bit = n - 1; bit >= 0; bit--) {
      inputs.push((i >> bit) & 1)
    }
    rows.push({ inputs, output: evaluateGate(gate, inputs) })
  }
  return rows
}

export default function SimuladorCompuertas() {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND')
  const [numInputs, setNumInputs] = useState(2)

  const gateInfo = GATES.find(g => g.name === selectedGate)!

  function onGateChange(gate: GateType) {
    setSelectedGate(gate)
    const info = GATES.find(g => g.name === gate)!
    setNumInputs(Math.min(Math.max(numInputs, info.minInputs), info.maxInputs))
  }

  const table = buildTruthTable(selectedGate, numInputs)
  const inputLabels = Array.from({ length: numInputs }, (_, i) => String.fromCharCode(65 + i))

  const expression = (() => {
    switch (selectedGate) {
      case 'AND':    return `F = ${inputLabels.join(' · ')}`
      case 'OR':     return `F = ${inputLabels.join(' + ')}`
      case 'NOT':    return `F = Ā`
      case 'BUFFER': return `F = A`
      case 'XOR':    return `F = ${inputLabels.join(' ⊕ ')}`
      case 'NAND':   return `F = ¬(${inputLabels.join(' · ')})`
      case 'NOR':    return `F = ¬(${inputLabels.join(' + ')})`
      case 'XNOR':   return `F = ¬(${inputLabels.join(' ⊕ ')})`
    }
  })()

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-accent mb-2">Simulador de Compuertas Lógicas</h2>
      <p className="text-muted text-sm mb-6">HU-3.1 — Tabla de verdad y expresión booleana</p>

      {/* Gate selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GATES.map(g => (
          <button
            key={g.name}
            onClick={() => onGateChange(g.name)}
            className={`px-4 py-2 rounded-md font-mono text-sm font-bold transition-colors ${
              selectedGate === g.name
                ? 'bg-accent text-bg'
                : 'bg-bg border border-border text-text hover:border-accent'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Gate info */}
      <div className="flex flex-wrap items-start gap-6 mb-6">
        <div className="bg-bg border border-border rounded-lg p-4 flex flex-col items-center min-w-24">
          <div className="text-xs text-muted mb-1 uppercase tracking-wide">Símbolo</div>
          <div className="text-3xl font-mono text-accent2 leading-none">{gateInfo.symbol}</div>
          <div className="text-lg font-bold text-accent mt-1">{gateInfo.name}</div>
        </div>
        <div className="flex-1 min-w-48">
          <p className="text-text mb-2">{gateInfo.description}</p>
          <p className="font-mono text-accent3 text-lg">{expression}</p>
        </div>
        {gateInfo.maxInputs > 1 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted uppercase tracking-wide">Entradas</label>
            <div className="flex gap-2">
              {Array.from(
                { length: gateInfo.maxInputs - gateInfo.minInputs + 1 },
                (_, i) => i + gateInfo.minInputs
              ).map(n => (
                <button
                  key={n}
                  onClick={() => setNumInputs(n)}
                  className={`w-9 h-9 rounded-md font-mono font-bold text-sm transition-colors ${
                    numInputs === n
                      ? 'bg-accent2 text-bg'
                      : 'bg-bg border border-border text-text hover:border-accent2'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Truth table */}
      <div className="overflow-x-auto">
        <table className="text-sm w-full">
          <thead>
            <tr className="border-b border-border">
              {inputLabels.map(l => (
                <th key={l} className="text-muted font-mono px-5 py-2 text-center">{l}</th>
              ))}
              <th className="text-accent2 font-mono px-5 py-2 text-center border-l border-border">F</th>
              <th className="text-muted px-4 py-2 text-left border-l border-border font-normal text-xs">Evaluación</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-border last:border-0 ${row.output === 1 ? 'bg-accent3/5' : ''}`}
              >
                {row.inputs.map((inp, j) => (
                  <td key={j} className="font-mono px-5 py-2 text-center text-text">{inp}</td>
                ))}
                <td className={`font-mono px-5 py-2 text-center font-bold border-l border-border ${
                  row.output === 1 ? 'text-accent3' : 'text-accent4'
                }`}>
                  {row.output}
                </td>
                <td className="px-4 py-2 text-xs text-muted border-l border-border">
                  {explainRow(selectedGate, row.inputs, inputLabels)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Minterminos / Maxterminos */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
        <div>
          <span className="text-accent3 font-semibold">Mintérminos (F=1): </span>
          {table.filter(r => r.output === 1).map((_, i) =>
            table.findIndex((r, ri) => r.output === 1 && ri >= i * 1)
          ).length === 0
            ? 'Ninguno'
            : table.map((r, i) => r.output === 1 ? `m${i}` : null).filter(Boolean).join(', ')
          }
        </div>
        <div>
          <span className="text-accent4 font-semibold">Maxtérminos (F=0): </span>
          {table.filter(r => r.output === 0).length === 0
            ? 'Ninguno'
            : table.map((r, i) => r.output === 0 ? `M${i}` : null).filter(Boolean).join(', ')
          }
        </div>
      </div>
    </div>
  )
}
