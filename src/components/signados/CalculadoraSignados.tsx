'use client'

import { useState } from 'react'

type BitCount = 4 | 8 | 16

interface Step {
  label: string
  detail: string
  mono?: string
}

interface SignedResult {
  method: string
  binary: string
  valid: boolean
  steps: Step[]
  rangeMin: number
  rangeMax: number
}

function decToBin(n: number, bits: number): string {
  const d: number[] = []
  let v = Math.abs(n)
  for (let i = 0; i < bits; i++) { d.unshift(v % 2); v = Math.floor(v / 2) }
  return d.join('')
}

function splitBin(bin: string, g = 4): string {
  const out: string[] = []
  for (let i = 0; i < bin.length; i += g) out.push(bin.slice(i, i + g))
  return out.join(' ')
}

function computeSignMagnitude(n: number, bits: number): SignedResult {
  const rangeMax = Math.pow(2, bits - 1) - 1
  const rangeMin = -rangeMax
  const valid = n >= rangeMin && n <= rangeMax
  const steps: Step[] = []
  let binary = ''

  if (valid) {
    const signBit = n < 0 ? '1' : '0'
    const abs = Math.abs(n)
    const mag = decToBin(abs, bits - 1)
    binary = signBit + mag

    steps.push({
      label: 'Paso 1',
      detail: n < 0
        ? 'El número es negativo → bit de signo (MSB) = 1'
        : 'El número es positivo → bit de signo (MSB) = 0',
      mono: `signo = ${signBit}`,
    })
    steps.push({
      label: 'Paso 2',
      detail: `Calcular valor absoluto: |${n}| = ${abs}`,
      mono: `|${n}| = ${abs}`,
    })
    steps.push({
      label: 'Paso 3',
      detail: `Convertir ${abs} a binario en ${bits - 1} bits (parte de magnitud)`,
      mono: `${abs} → ${mag}`,
    })
    steps.push({
      label: 'Paso 4',
      detail: `Concatenar: [signo] | [magnitud] = resultado final`,
      mono: `${signBit} | ${mag}  →  ${binary}`,
    })
    if (n === 0) {
      steps.push({
        label: 'Nota',
        detail: `Doble cero: existe +0 = ${'0'.repeat(bits)} y también −0 = 1${'0'.repeat(bits - 1)}`,
      })
    }
  }

  return { method: 'Signo y Magnitud', binary, valid, steps, rangeMin, rangeMax }
}

function computeComplementoUno(n: number, bits: number): SignedResult {
  const rangeMax = Math.pow(2, bits - 1) - 1
  const rangeMin = -rangeMax
  const valid = n >= rangeMin && n <= rangeMax
  const steps: Step[] = []
  let binary = ''

  if (valid) {
    if (n >= 0) {
      binary = decToBin(n, bits)
      steps.push({
        label: 'Paso 1',
        detail: `El número es positivo → representación directa en ${bits} bits`,
        mono: `${n} → ${binary}`,
      })
    } else {
      const abs = -n
      const posBin = decToBin(abs, bits)
      binary = posBin.split('').map(b => b === '0' ? '1' : '0').join('')
      steps.push({
        label: 'Paso 1',
        detail: `Convertir |${n}| = ${abs} a binario en ${bits} bits`,
        mono: `${abs} → ${posBin}`,
      })
      steps.push({
        label: 'Paso 2',
        detail: 'Invertir CADA bit: 0→1, 1→0 (complementar)',
        mono: `${posBin}  →  ${binary}`,
      })
    }
    if (n === 0) {
      steps.push({
        label: 'Nota',
        detail: `Doble cero: existe +0 = ${'0'.repeat(bits)} y también −0 = ${'1'.repeat(bits)}`,
      })
    }
  }

  return { method: 'Complemento a 1', binary, valid, steps, rangeMin, rangeMax }
}

function computeComplementoDos(n: number, bits: number): SignedResult {
  const rangeMax = Math.pow(2, bits - 1) - 1
  const rangeMin = -(Math.pow(2, bits - 1))
  const valid = n >= rangeMin && n <= rangeMax
  const steps: Step[] = []
  let binary = ''

  if (valid) {
    if (n >= 0) {
      binary = decToBin(n, bits)
      steps.push({
        label: 'Paso 1',
        detail: `El número es positivo → representación directa en ${bits} bits`,
        mono: `${n} → ${binary}`,
      })
    } else {
      const abs = -n
      const posBin = decToBin(abs, bits)
      const c1 = posBin.split('').map(b => b === '0' ? '1' : '0').join('')
      const digits = c1.split('').map(Number)
      let carry = 1
      for (let i = digits.length - 1; i >= 0 && carry; i--) {
        const sum = digits[i] + carry
        digits[i] = sum % 2
        carry = Math.floor(sum / 2)
      }
      binary = digits.join('')

      steps.push({
        label: 'Paso 1',
        detail: `Convertir |${n}| = ${abs} a binario en ${bits} bits`,
        mono: `${abs} → ${posBin}`,
      })
      steps.push({
        label: 'Paso 2',
        detail: 'Obtener Complemento a 1 (invertir todos los bits)',
        mono: `${posBin}  →  ${c1}`,
      })
      steps.push({
        label: 'Paso 3',
        detail: 'Sumar 1 al Complemento a 1',
        mono: `${c1}  +  1  =  ${binary}`,
      })
    }
    steps.push({
      label: 'Ventaja',
      detail: 'C2 tiene representación única del cero y un rango asimétrico: un negativo más que positivos',
      mono: `Rango: [${rangeMin}, ${rangeMax}]`,
    })
  }

  return { method: 'Complemento a 2', binary, valid, steps, rangeMin, rangeMax }
}

function computeExcesoK(n: number, bits: number): SignedResult {
  const k = Math.pow(2, bits - 1)
  const rangeMax = k - 1
  const rangeMin = -k
  const valid = n >= rangeMin && n <= rangeMax
  const steps: Step[] = []
  let binary = ''

  if (valid) {
    const biased = n + k
    binary = decToBin(biased, bits)

    steps.push({
      label: 'Paso 1',
      detail: `Calcular constante K = 2^(n−1) = 2^${bits - 1}`,
      mono: `K = ${k}`,
    })
    steps.push({
      label: 'Paso 2',
      detail: `Desplazar el número sumando K: ${n} + ${k} = ${biased}`,
      mono: `${n} + ${k} = ${biased}`,
    })
    steps.push({
      label: 'Paso 3',
      detail: `Convertir el valor desplazado (${biased}) a binario en ${bits} bits`,
      mono: `${biased} → ${binary}`,
    })
  }

  return { method: `Exceso a K (K=${k})`, binary, valid, steps, rangeMin, rangeMax }
}

export default function CalculadoraSignados() {
  const [input, setInput] = useState('')
  const [bits, setBits] = useState<BitCount>(8)
  const [results, setResults] = useState<SignedResult[] | null>(null)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function compute() {
    const n = parseInt(input, 10)
    if (isNaN(n) || input.trim() === '') {
      setError('Ingresá un número entero válido')
      setResults(null)
      return
    }
    setError('')
    const res = [
      computeSignMagnitude(n, bits),
      computeComplementoUno(n, bits),
      computeComplementoDos(n, bits),
      computeExcesoK(n, bits),
    ]
    setResults(res)
    setExpanded(new Set(res.filter(r => r.valid).map(r => r.method)))
  }

  function toggleExpand(method: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(method)) next.delete(method)
      else next.add(method)
      return next
    })
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-accent mb-2">Calculadora de Representaciones con Signo</h2>
      <p className="text-muted text-sm mb-6">HU-2.1 · HU-2.2 · HU-2.3 — Épica 2</p>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wide">Número decimal</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && compute()}
            placeholder="Ej: -13"
            className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-40 focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wide">Cantidad de bits</label>
          <select
            value={bits}
            onChange={e => setBits(Number(e.target.value) as BitCount)}
            className="bg-bg border border-border text-text px-4 py-2 rounded-md focus:outline-none focus:border-accent"
          >
            <option value={4}>4 bits</option>
            <option value={8}>8 bits</option>
            <option value={16}>16 bits</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={compute}
            className="bg-accent text-bg font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Calcular
          </button>
        </div>
      </div>

      {error && <p className="text-accent4 text-sm mb-4">{error}</p>}

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map(r => (
            <div
              key={r.method}
              className={`bg-bg border rounded-lg overflow-hidden ${r.valid ? 'border-border' : 'border-accent4/40'}`}
            >
              {/* Card header — clickable to toggle steps */}
              <button
                className="w-full text-left p-4 flex items-start justify-between gap-4"
                onClick={() => r.valid && toggleExpand(r.method)}
                disabled={!r.valid}
              >
                <div>
                  <p className="font-semibold text-accent2">{r.method}</p>
                  <p className="text-xs text-muted mt-0.5">
                    Rango: [{r.rangeMin}, {r.rangeMax}]
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {r.valid ? (
                    <>
                      <p className="font-mono text-accent3 text-base tracking-widest leading-none">
                        {splitBin(r.binary)}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {expanded.has(r.method) ? '▲ ocultar pasos' : '▼ ver pasos'}
                      </p>
                    </>
                  ) : (
                    <p className="text-accent4 text-sm italic">Fuera de rango</p>
                  )}
                </div>
              </button>

              {/* Step-by-step panel */}
              {r.valid && expanded.has(r.method) && (
                <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                  {r.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-xs font-bold text-accent2 whitespace-nowrap pt-0.5 w-16 shrink-0">
                        {step.label}
                      </span>
                      <div className="flex-1">
                        <p className="text-text leading-snug">{step.detail}</p>
                        {step.mono && (
                          <p className="font-mono text-accent3 text-xs mt-1 bg-surface2 rounded px-2 py-1">
                            {step.mono}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
