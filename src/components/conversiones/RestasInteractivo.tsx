'use client'

import { useState } from 'react'

interface Step {
  remainder: number
  power: number
  powerVal: number
  bit: number
  newRemainder: number
}

function restaSucesiva(n: number): { steps: Step[]; binary: string } {
  if (n === 0) return { steps: [], binary: '0' }
  const maxPow = Math.floor(Math.log2(n))
  const steps: Step[] = []
  let rem = n
  for (let p = maxPow; p >= 0; p--) {
    const val = Math.pow(2, p)
    if (rem >= val) {
      steps.push({ remainder: rem, power: p, powerVal: val, bit: 1, newRemainder: rem - val })
      rem -= val
    } else {
      steps.push({ remainder: rem, power: p, powerVal: val, bit: 0, newRemainder: rem })
    }
  }
  return { steps, binary: steps.map(s => s.bit).join('') }
}

export default function RestasInteractivo() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ steps: Step[]; binary: string } | null>(null)
  const [error, setError] = useState('')

  function compute() {
    setError(''); setResult(null)
    const n = parseInt(input, 10)
    if (isNaN(n) || n < 0) { setError('Ingresá un entero no negativo'); return }
    if (n > 65535) { setError('Máximo permitido: 65535'); return }
    setResult(restaSucesiva(n))
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-accent mb-1">Restas Sucesivas</h2>
      <p className="text-muted text-sm mb-5">HU-1.5 — Conversión Decimal → Binario por restas de potencias de 2</p>

      <div className="text-sm text-muted bg-surface2 border border-border rounded-lg px-4 py-3 mb-5">
        <p className="font-semibold text-text mb-1">Método</p>
        <ol className="list-decimal list-inside space-y-0.5">
          <li>Encontrá la mayor potencia de 2 ≤ N → asigná bit = 1, restá</li>
          <li>Si la potencia es mayor que el resto → bit = 0</li>
          <li>Repetí hasta la potencia 2⁰</li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wide">Número decimal</label>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && compute()}
            placeholder="ej: 45"
            className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-36 focus:outline-none focus:border-accent" />
        </div>
        <button onClick={compute}
          className="bg-accent text-bg font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
          Convertir
        </button>
      </div>
      {error && <p className="text-accent4 text-sm mb-4">{error}</p>}

      {result && (
        <div className="space-y-4">
          {result.steps.length === 0 ? (
            <div className="bg-bg border border-border rounded-lg p-4 text-center">
              <p className="font-mono text-3xl text-accent3 font-bold">0</p>
              <p className="text-muted text-sm mt-1">0₁₀ = 0₂</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="text-sm w-full">
                  <thead>
                    <tr className="bg-surface2 border-b border-border">
                      <th className="text-left px-3 py-2 text-muted font-normal">Resto actual</th>
                      <th className="text-left px-3 py-2 text-muted font-normal">Potencia</th>
                      <th className="text-left px-3 py-2 text-muted font-normal">Valor</th>
                      <th className="text-left px-3 py-2 text-muted font-normal">Comparación</th>
                      <th className="text-center px-3 py-2 text-accent2 font-bold">Bit</th>
                      <th className="text-left px-3 py-2 text-muted font-normal">Nuevo resto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps.map((s, i) => (
                      <tr key={i} className={`border-b border-border last:border-0 ${s.bit === 1 ? 'bg-accent3/5' : ''}`}>
                        <td className="px-3 py-2 font-mono text-text">{s.remainder}</td>
                        <td className="px-3 py-2 font-mono text-accent2">2<sup>{s.power}</sup></td>
                        <td className="px-3 py-2 font-mono text-text">{s.powerVal}</td>
                        <td className="px-3 py-2 text-xs text-muted">
                          {s.remainder} {s.bit === 1 ? '≥' : '<'} {s.powerVal}
                          {s.bit === 1 ? ` → restamos ${s.powerVal}` : ' → no restamos'}
                        </td>
                        <td className={`px-3 py-2 font-mono font-bold text-center text-lg ${s.bit === 1 ? 'text-accent3' : 'text-accent4'}`}>
                          {s.bit}
                        </td>
                        <td className="px-3 py-2 font-mono text-text">{s.newRemainder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-bg border border-border rounded-lg p-4">
                <p className="text-xs text-muted uppercase tracking-wide mb-2">Resultado — leer bits de arriba a abajo (MSB → LSB)</p>
                <div className="flex gap-1 flex-wrap mb-3">
                  {result.steps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-[9px] text-muted font-mono">2<sup>{s.power}</sup></span>
                      <span className={`font-mono font-bold text-lg w-7 text-center ${s.bit === 1 ? 'text-accent3' : 'text-muted'}`}>{s.bit}</span>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-3xl font-bold text-accent3 tracking-widest">{result.binary}</p>
                <p className="text-muted text-sm mt-1 font-mono">{parseInt(input, 10)}<sub>10</sub> = {result.binary}<sub>2</sub></p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
