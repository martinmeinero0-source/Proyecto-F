'use client'

import { useState, useMemo } from 'react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function decToBin(n: number, bits: number): string {
  return Math.abs(n).toString(2).padStart(bits, '0')
}

function twosComplement(n: number, bits = 8): string {
  if (n >= 0) return decToBin(n, bits)
  const pos = decToBin(-n, bits)
  const c1 = pos.split('').map(b => b === '0' ? '1' : '0').join('')
  const num = parseInt(c1, 2) + 1
  return num.toString(2).padStart(bits, '0')
}

interface DivStep { dividend: number; quotient: number; remainder: number }

function divisionSteps(n: number): DivStep[] {
  const steps: DivStep[] = []
  let v = n
  while (v > 0) {
    steps.push({ dividend: v, quotient: Math.floor(v / 2), remainder: v % 2 })
    v = Math.floor(v / 2)
  }
  return steps
}

interface AsciiChar { char: string; code: number; hex: string; bin: string }

function toAscii(s: string): AsciiChar[] {
  return s.split('').map(c => ({
    char: c, code: c.charCodeAt(0),
    hex: c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'),
    bin: c.charCodeAt(0).toString(2).padStart(8, '0'),
  }))
}

// Hamming(7,4) encoding: d1 d2 d3 d4 → p1 p2 d1 p3 d2 d3 d4
function hamming74(data4: string): { encoded: string; parities: [number, number, number]; layout: string[] } {
  const [d1, d2, d3, d4] = data4.split('').map(Number)
  const p1 = (d1 ^ d2 ^ d4) & 1
  const p2 = (d1 ^ d3 ^ d4) & 1
  const p3 = (d2 ^ d3 ^ d4) & 1
  const encoded = `${p1}${p2}${d1}${p3}${d2}${d3}${d4}`
  const layout = ['p1','p2','d1','p3','d2','d3','d4']
  return { encoded, parities: [p1, p2, p3], layout }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ScenarioResult {
  temp: number
  tempStr: string
  absBin: string
  divSteps: DivStep[]
  signedBin: string
  isNeg: boolean
  c1: string
  ascii: AsciiChar[]
  hamming: { encoded: string; parities: [number, number, number]; layout: string[]; data4: string }
}

export default function SimuladorEscenario() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ScenarioResult | null>(null)
  const [error, setError]   = useState('')
  const [openStep, setOpenStep] = useState<number[]>([0, 1, 2, 3, 4])

  function compute() {
    setError(''); setResult(null)
    const t = parseInt(input, 10)
    if (isNaN(t)) { setError('Ingresá un número entero'); return }
    if (t < -128 || t > 127) { setError('Rango soportado: −128 a 127 (8 bits con signo)'); return }

    const tempStr = `${t}°C`
    const absBin  = decToBin(Math.abs(t), 8)
    const divSt   = divisionSteps(Math.abs(t))
    const isNeg   = t < 0
    const pos8    = decToBin(Math.abs(t), 8)
    const c1      = isNeg ? pos8.split('').map(b => b === '0' ? '1' : '0').join('') : pos8
    const signedBin = twosComplement(t, 8)
    const ascii   = toAscii(tempStr)

    // Hamming on the upper 4 bits of the signed representation
    const data4   = signedBin.slice(0, 4)
    const h       = hamming74(data4)

    setResult({ temp: t, tempStr, absBin, divSteps: divSt, signedBin, isNeg, c1, ascii, hamming: { ...h, data4 } })
    setOpenStep([0, 1, 2, 3, 4])
  }

  function toggleStep(i: number) {
    setOpenStep(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])
  }

  const STEPS = result ? [
    {
      title: 'Paso 1 — Conversión a binario (Épica 1)',
      badge: 'Divisiones Sucesivas',
      color: 'text-accent',
      content: (
        <div className="space-y-3">
          <p className="text-muted text-sm">Número absoluto: |{result.temp}| = {Math.abs(result.temp)}</p>
          {result.divSteps.length === 0 ? (
            <p className="font-mono text-accent3 text-xl">0 = 00000000₂</p>
          ) : (
            <div className="overflow-x-auto rounded border border-border">
              <table className="text-sm w-full">
                <thead className="bg-surface2">
                  <tr className="text-muted text-xs">
                    <th className="text-left px-3 py-1.5">Dividendo</th>
                    <th className="text-left px-3 py-1.5">÷ 2</th>
                    <th className="text-left px-3 py-1.5 text-accent2">Residuo (bit)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.divSteps.map((s, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-1.5 font-mono">{s.dividend}</td>
                      <td className="px-3 py-1.5 font-mono">{s.quotient}</td>
                      <td className="px-3 py-1.5 font-mono font-bold text-accent2">{s.remainder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="font-mono text-accent3 text-lg">|{result.temp}|₁₀ = <span className="tracking-widest">{result.absBin}</span>₂</p>
        </div>
      ),
    },
    {
      title: 'Paso 2 — Representación con signo (Épica 2)',
      badge: 'Complemento a 2',
      color: 'text-accent2',
      content: (
        <div className="space-y-3">
          {!result.isNeg ? (
            <div>
              <p className="text-muted text-sm mb-2">El número es positivo → representación directa en 8 bits.</p>
              <p className="font-mono text-accent3 text-lg">{result.temp} → <span className="tracking-widest">{result.signedBin}</span></p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted text-sm">El número es negativo → aplicamos Complemento a 2:</p>
              <div className="bg-bg border border-border rounded-lg p-3 space-y-1.5 font-mono text-sm">
                <p><span className="text-muted w-40 inline-block">|{result.temp}|₁₀ en 8 bits:</span> <span className="text-text tracking-widest">{result.absBin}</span></p>
                <p><span className="text-muted w-40 inline-block">Complemento a 1 (invertir):</span> <span className="text-accent2 tracking-widest">{result.c1}</span></p>
                <p><span className="text-muted w-40 inline-block">Complemento a 2 (+ 1):</span> <span className="text-accent3 tracking-widest font-bold">{result.signedBin}</span></p>
              </div>
              <p className="font-mono text-xs text-muted">Verificación: MSB={result.signedBin[0]} → número negativo ✓</p>
            </div>
          )}
          <div className="bg-bg border border-border rounded-lg p-3 flex gap-1 flex-wrap">
            {result.signedBin.split('').map((b, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[9px] text-muted">{7-i}</span>
                <span className={`font-mono font-bold text-lg w-7 text-center rounded ${i === 0 ? (result.isNeg ? 'text-accent4' : 'text-accent3') : b === '1' ? 'text-text' : 'text-muted'}`}>{b}</span>
                {i === 0 && <span className="text-[9px] text-muted">signo</span>}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Paso 3 — Codificación ASCII para pantalla (Épica 4)',
      badge: 'Tabla ASCII',
      color: 'text-accent3',
      content: (
        <div className="space-y-2">
          <p className="text-muted text-sm">Temperatura como string: <span className="font-mono text-accent2">"{result.tempStr}"</span> — {result.ascii.length} caracteres</p>
          <div className="overflow-x-auto rounded border border-border">
            <table className="text-sm w-full">
              <thead className="bg-surface2">
                <tr className="text-muted text-xs">
                  <th className="text-center px-3 py-1.5">Char</th>
                  <th className="text-center px-3 py-1.5">Decimal</th>
                  <th className="text-center px-3 py-1.5">Hex</th>
                  <th className="text-center px-3 py-1.5">Binario (8 bits)</th>
                </tr>
              </thead>
              <tbody>
                {result.ascii.map((a, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-1.5 font-mono text-center font-bold text-accent2">{a.char === '°' ? '°' : a.char}</td>
                    <td className="px-3 py-1.5 font-mono text-center">{a.code}</td>
                    <td className="px-3 py-1.5 font-mono text-center text-accent">{a.hex}</td>
                    <td className="px-3 py-1.5 font-mono text-center text-accent3 tracking-widest">{a.bin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      title: 'Paso 4 — Protección con código Hamming (Épica 4)',
      badge: 'Hamming(7,4)',
      color: 'text-accent4',
      content: (
        <div className="space-y-3">
          <p className="text-muted text-sm">Codificamos los primeros 4 bits de la temperatura con signo usando Hamming(7,4).</p>
          <div className="bg-bg border border-border rounded-lg p-3 font-mono text-sm space-y-2">
            <p><span className="text-muted w-48 inline-block">Datos (4 bits, d1–d4):</span> <span className="text-accent2 tracking-widest font-bold">{result.hamming.data4}</span></p>
            <p><span className="text-muted w-48 inline-block">p1 = d1⊕d2⊕d4:</span> <span className="text-accent">{result.hamming.parities[0]}</span></p>
            <p><span className="text-muted w-48 inline-block">p2 = d1⊕d3⊕d4:</span> <span className="text-accent">{result.hamming.parities[1]}</span></p>
            <p><span className="text-muted w-48 inline-block">p3 = d2⊕d3⊕d4:</span> <span className="text-accent">{result.hamming.parities[2]}</span></p>
          </div>
          <div>
            <p className="text-xs text-muted mb-2">Palabra codificada (7 bits) — posiciones 1-7:</p>
            <div className="flex gap-1">
              {result.hamming.encoded.split('').map((b, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-[9px] text-muted">p{i+1 <= 3 ? i+1 : ''}</span>
                  <span className={`font-mono font-bold text-lg w-9 text-center rounded border ${
                    result.hamming.layout[i].startsWith('p')
                      ? 'border-accent/40 text-accent bg-accent/10'
                      : 'border-accent2/40 text-accent2 bg-accent2/10'
                  }`}>{b}</span>
                  <span className="text-[9px] text-muted">{result.hamming.layout[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">
              Detecta y corrige hasta 1 bit de error · <span className="text-accent">azul</span> = paridad · <span className="text-accent2">amarillo</span> = datos
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Paso 5 — Resumen del paquete de datos',
      badge: 'Integración',
      color: 'text-accent3',
      content: (
        <div className="space-y-3">
          <p className="text-muted text-sm">Paquete final listo para transmisión:</p>
          <div className="bg-bg border border-border rounded-lg p-4 space-y-2 font-mono text-sm">
            <div className="flex items-center gap-3">
              <span className="text-muted w-52">Temperatura original:</span>
              <span className="text-accent2 font-bold">{result.temp}°C</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted w-52">Binario (C2, 8 bits):</span>
              <span className="text-accent3 tracking-widest font-bold">{result.signedBin}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted w-52">Protección Hamming(7,4):</span>
              <span className="text-accent tracking-widest">{result.hamming.encoded}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted w-52">Display ASCII:</span>
              <span className="text-accent2">{result.ascii.map(a => a.hex).join(' ')}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-accent3/10 border border-accent3/30 rounded-lg p-3">
              <p className="text-accent3 font-bold mb-1">Épica 1 ✓</p>
              <p className="text-muted">Divisiones sucesivas para convertir a binario</p>
            </div>
            <div className="bg-accent2/10 border border-accent2/30 rounded-lg p-3">
              <p className="text-accent2 font-bold mb-1">Épica 2 ✓</p>
              <p className="text-muted">{result.isNeg ? 'Complemento a 2 para negativos' : 'Representación directa (positivo)'}</p>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <p className="text-accent font-bold mb-1">Épica 4 ✓ (ASCII)</p>
              <p className="text-muted">Codificación ASCII para pantalla LCD</p>
            </div>
            <div className="bg-accent4/10 border border-accent4/30 rounded-lg p-3">
              <p className="text-accent4 font-bold mb-1">Épica 4 ✓ (Hamming)</p>
              <p className="text-muted">Corrección de 1 error en transmisión</p>
            </div>
          </div>
        </div>
      ),
    },
  ] : []

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-accent mb-1">Escenario del Termómetro Digital</h2>
      <p className="text-muted text-sm mb-5">HU-5.1 — Recorrido integrado: Épicas 1, 2 y 4 aplicadas a un sensor de temperatura</p>

      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wide">Temperatura (°C)</label>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && compute()}
            placeholder="ej: 23 o -5"
            className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-36 focus:outline-none focus:border-accent" />
          <span className="text-[10px] text-muted">Rango: −128 a 127°C</span>
        </div>
        <button onClick={compute} className="bg-accent text-bg font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
          Procesar
        </button>
      </div>
      {error && <p className="text-accent4 text-sm mb-4">{error}</p>}

      {result && (
        <div className="space-y-2">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-bg border border-border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => toggleStep(i)}>
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-sm ${step.color}`}>{step.title}</span>
                  <span className="text-[10px] text-muted bg-surface2 border border-border px-2 py-0.5 rounded-full">{step.badge}</span>
                </div>
                <span className="text-muted text-xs">{openStep.includes(i) ? '▲' : '▼'}</span>
              </button>
              {openStep.includes(i) && (
                <div className="border-t border-border px-4 pb-4 pt-3">
                  {step.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
