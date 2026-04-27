'use client'

import { useState } from 'react'
import {
  convertDecimalToBase,
  convertBaseToDecimal,
  bin2oct,
  bin2hex,
  oct2bin,
  hex2bin,
  convertFractionalDecimalToBinary,
  type HU11Result,
  type HU13Result,
  type DirectConversionResult,
  type HU12Result,
} from '@/modules/conversiones-numericas/lib/conversiones'

type Tab = 'decimal-base' | 'base-decimal' | 'directa' | 'fraccionaria'
type TargetBase = 2 | 8 | 16
type DirectType = 'bin-hex' | 'bin-oct' | 'hex-bin' | 'oct-bin'

const BASE_LABELS: Record<TargetBase, string> = { 2: 'Binario', 8: 'Octal', 16: 'Hexadecimal' }

const TABS: { id: Tab; label: string; sp: string }[] = [
  { id: 'decimal-base', label: 'Decimal → Base', sp: 'HU-1.1' },
  { id: 'base-decimal', label: 'Base → Decimal', sp: 'HU-1.3' },
  { id: 'directa', label: 'Bin ↔ Oct/Hex', sp: 'HU-1.4' },
  { id: 'fraccionaria', label: 'Fraccionario', sp: 'HU-1.2' },
]

function ErrorMsg({ msg }: { msg: string }) {
  return msg ? <p className="text-accent4 text-sm mt-2">{msg}</p> : null
}

export default function ConversorInteractivo() {
  const [tab, setTab] = useState<Tab>('decimal-base')

  // HU-1.1
  const [d2bInput, setD2bInput] = useState('')
  const [d2bBase, setD2bBase] = useState<TargetBase>(2)
  const [d2bResult, setD2bResult] = useState<HU11Result | null>(null)
  const [d2bErr, setD2bErr] = useState('')

  // HU-1.3
  const [b2dInput, setB2dInput] = useState('')
  const [b2dBase, setB2dBase] = useState<TargetBase>(2)
  const [b2dResult, setB2dResult] = useState<HU13Result | null>(null)
  const [b2dErr, setB2dErr] = useState('')

  // HU-1.4
  const [dirInput, setDirInput] = useState('')
  const [dirType, setDirType] = useState<DirectType>('bin-hex')
  const [dirResult, setDirResult] = useState<DirectConversionResult | null>(null)
  const [dirErr, setDirErr] = useState('')

  // HU-1.2
  const [fracInput, setFracInput] = useState('')
  const [fracBits, setFracBits] = useState(16)
  const [fracResult, setFracResult] = useState<HU12Result | null>(null)
  const [fracErr, setFracErr] = useState('')

  const runD2B = () => {
    setD2bErr(''); setD2bResult(null)
    const n = parseInt(d2bInput)
    if (isNaN(n) || n < 0) { setD2bErr('Ingresá un entero positivo'); return }
    try { setD2bResult(convertDecimalToBase(n, d2bBase)) }
    catch (e) { setD2bErr(e instanceof Error ? e.message : 'Error') }
  }

  const runB2D = () => {
    setB2dErr(''); setB2dResult(null)
    if (!b2dInput.trim()) { setB2dErr('Ingresá un número'); return }
    try { setB2dResult(convertBaseToDecimal(b2dInput.trim(), b2dBase)) }
    catch (e) { setB2dErr(e instanceof Error ? e.message : 'Error') }
  }

  const runDir = () => {
    setDirErr(''); setDirResult(null)
    if (!dirInput.trim()) { setDirErr('Ingresá un número'); return }
    try {
      const fn = { 'bin-hex': bin2hex, 'bin-oct': bin2oct, 'hex-bin': hex2bin, 'oct-bin': oct2bin }[dirType]
      setDirResult(fn(dirInput.trim()))
    }
    catch (e) { setDirErr(e instanceof Error ? e.message : 'Error') }
  }

  const runFrac = () => {
    setFracErr(''); setFracResult(null)
    const n = parseFloat(fracInput)
    if (isNaN(n) || n <= 0 || n >= 1) { setFracErr('Debe ser un número entre 0 y 1 (exclusivo), ej: 0.6875'); return }
    try { setFracResult(convertFractionalDecimalToBinary(n, fracBits)) }
    catch (e) { setFracErr(e instanceof Error ? e.message : 'Error') }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold text-accent mb-5">Conversor Interactivo</h2>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'bg-accent text-white'
                : 'bg-surface2 text-muted hover:text-text border border-border'
            }`}
          >
            <span className="text-xs opacity-60 mr-1">{t.sp}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HU-1.1: Decimal → Base ── */}
      {tab === 'decimal-base' && (
        <div className="space-y-4">
          <p className="text-muted text-sm">Método: Divisiones Sucesivas — divide por la base hasta cociente 0, lee residuos de abajo a arriba.</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-muted mb-1">Número decimal</label>
              <input type="number" min="0" value={d2bInput} onChange={e => setD2bInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runD2B()} placeholder="ej: 26"
                className="bg-surface2 border border-border rounded px-3 py-2 text-text w-36 focus:outline-none focus:border-accent font-mono" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Base destino</label>
              <select value={d2bBase} onChange={e => setD2bBase(Number(e.target.value) as TargetBase)}
                className="bg-surface2 border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-accent">
                <option value={2}>Binario (2)</option>
                <option value={8}>Octal (8)</option>
                <option value={16}>Hexadecimal (16)</option>
              </select>
            </div>
            <button onClick={runD2B} className="bg-accent hover:bg-accent/80 text-white px-6 py-2 rounded font-semibold transition-colors">
              Convertir
            </button>
          </div>
          <ErrorMsg msg={d2bErr} />
          {d2bResult && (
            <div className="space-y-4 mt-2">
              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface2">
                    <tr className="text-muted">
                      <th className="text-left px-3 py-2 w-16">Paso</th>
                      <th className="text-left px-3 py-2">Operación</th>
                      <th className="text-left px-3 py-2">Cociente</th>
                      <th className="text-left px-3 py-2 text-accent2">Residuo</th>
                      <th className="text-left px-3 py-2 text-muted">Posición</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d2bResult.steps.map((s, i) => {
                      const isLast = i === d2bResult.steps.length - 1
                      const residuo = d2bResult.resultDigits[d2bResult.steps.length - 1 - i]
                      return (
                        <tr key={i} className="border-t border-border hover:bg-surface2/50">
                          <td className="px-3 py-2 text-muted text-xs">{i + 1}</td>
                          <td className="px-3 py-2 font-mono text-text">
                            {s.dividend} ÷ {s.divisor} = {s.quotient}, resto {residuo}
                          </td>
                          <td className="px-3 py-2 font-mono text-text">{s.quotient}</td>
                          <td className="px-3 py-2 font-mono font-bold text-accent2">{residuo}</td>
                          <td className="px-3 py-2 text-xs text-muted">
                            {isLast ? '← MSB (más significativo)' : i === 0 ? '← LSB (menos significativo)' : ''}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-surface2 rounded-lg p-3 text-sm">
                <p className="text-muted mb-1">Leer residuos de <span className="text-accent2 font-semibold">abajo hacia arriba</span> (del último al primero):</p>
                <p className="font-mono text-accent3 tracking-widest">
                  {[...d2bResult.resultDigits].reverse().join(' ← ')}
                </p>
              </div>
              <div className="bg-surface2 rounded-lg p-4 text-center">
                <p className="text-muted text-xs mb-1">{d2bResult.original}<sub>10</sub> en {BASE_LABELS[d2bBase]}</p>
                <p className="text-3xl font-bold font-mono text-accent3">{d2bResult.result}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HU-1.3: Base → Decimal ── */}
      {tab === 'base-decimal' && (
        <div className="space-y-4">
          <p className="text-muted text-sm">Método: Representación Polinomial — cada dígito × base^posición.</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-muted mb-1">Número en base origen</label>
              <input type="text" value={b2dInput} onChange={e => setB2dInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runB2D()} placeholder="ej: 11010"
                className="bg-surface2 border border-border rounded px-3 py-2 text-text font-mono w-36 focus:outline-none focus:border-accent uppercase" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Base origen</label>
              <select value={b2dBase} onChange={e => setB2dBase(Number(e.target.value) as TargetBase)}
                className="bg-surface2 border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-accent">
                <option value={2}>Binario (2)</option>
                <option value={8}>Octal (8)</option>
                <option value={16}>Hexadecimal (16)</option>
              </select>
            </div>
            <button onClick={runB2D} className="bg-accent hover:bg-accent/80 text-white px-6 py-2 rounded font-semibold transition-colors">
              Convertir
            </button>
          </div>
          <ErrorMsg msg={b2dErr} />
          {b2dResult && (
            <div className="space-y-4 mt-2">
              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface2">
                    <tr className="text-muted">
                      <th className="text-left px-3 py-2 w-16">Paso</th>
                      <th className="text-left px-3 py-2">Dígito</th>
                      <th className="text-left px-3 py-2">Posición</th>
                      <th className="text-left px-3 py-2">Operación</th>
                      <th className="text-left px-3 py-2 text-accent2">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b2dResult.terms.map((t, i) => (
                      <tr key={i} className="border-t border-border hover:bg-surface2/50">
                        <td className="px-3 py-2 text-muted text-xs">{i + 1}</td>
                        <td className="px-3 py-2 font-mono text-accent2 font-bold">{t.digitStr}</td>
                        <td className="px-3 py-2 font-mono text-muted text-xs">exp {t.exp} (posición {b2dResult.terms.length - 1 - i} desde derecha)</td>
                        <td className="px-3 py-2 font-mono text-text">
                          {t.digitStr} × {b2dBase}<sup>{t.exp}</sup> = {t.digitStr} × {Math.pow(b2dBase, t.exp)}
                        </td>
                        <td className="px-3 py-2 font-mono font-bold text-accent3">{t.val}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-accent/40 bg-surface2/50">
                      <td colSpan={3} className="px-3 py-2 text-muted text-xs text-right">Suma total →</td>
                      <td className="px-3 py-2 font-mono text-xs text-muted">
                        {b2dResult.terms.map(t => t.val).join(' + ')}
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-accent3 text-lg">{b2dResult.result}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-surface2 rounded-lg p-4 text-center">
                <p className="text-muted text-xs mb-1">{b2dResult.input}<sub>{b2dBase}</sub> en Decimal</p>
                <p className="text-3xl font-bold font-mono text-accent3">{b2dResult.result}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HU-1.4: Directa ── */}
      {tab === 'directa' && (
        <div className="space-y-4">
          <p className="text-muted text-sm">Método: Agrupación de bits — binario↔octal (grupos de 3), binario↔hex (grupos de 4).</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-muted mb-1">Número</label>
              <input type="text" value={dirInput} onChange={e => setDirInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runDir()} placeholder="ej: 11010110"
                className="bg-surface2 border border-border rounded px-3 py-2 text-text font-mono w-44 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Conversión</label>
              <select value={dirType} onChange={e => setDirType(e.target.value as DirectType)}
                className="bg-surface2 border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-accent">
                <option value="bin-hex">Bin → Hex (×4 bits)</option>
                <option value="bin-oct">Bin → Oct (×3 bits)</option>
                <option value="hex-bin">Hex → Bin</option>
                <option value="oct-bin">Oct → Bin</option>
              </select>
            </div>
            <button onClick={runDir} className="bg-accent hover:bg-accent/80 text-white px-6 py-2 rounded font-semibold transition-colors">
              Convertir
            </button>
          </div>
          <ErrorMsg msg={dirErr} />
          {dirResult && (
            <div className="space-y-4 mt-2">
              <div className="bg-surface2 rounded-lg p-3 text-sm space-y-1">
                <p className="text-muted">
                  <span className="text-accent2 font-semibold">Paso 1:</span>{' '}
                  Agrupar bits de {dirType.includes('bin') ? `<span class="text-accent">derecha a izquierda</span>` : 'cada dígito'} en bloques de{' '}
                  <span className="text-accent font-semibold">{dirResult.groupSize} bits</span>
                  {dirType.startsWith('bin') ? ` (completar con 0s a la izquierda si es necesario)` : ''}
                </p>
                <p className="text-muted">
                  <span className="text-accent2 font-semibold">Paso 2:</span> Convertir cada grupo de forma independiente
                </p>
                <p className="text-muted">
                  <span className="text-accent2 font-semibold">Paso 3:</span> Concatenar los resultados
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {dirResult.groups.map((g, i) => (
                  <div key={i} className="bg-bg border border-border rounded-lg p-3 text-center min-w-[80px]">
                    <p className="text-xs text-muted mb-1">Grupo {i + 1}</p>
                    <p className="font-mono text-accent2 font-bold text-sm tracking-widest">{g.bits}</p>
                    <p className="text-muted text-xs my-1">↓</p>
                    <p className="font-mono text-accent3 text-xl font-bold">{g.hex ?? g.digit ?? g.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-surface2 rounded-lg p-3 text-sm text-muted">
                Concatenando los grupos: {dirResult.groups.map((g, i) => (
                  <span key={i} className="font-mono text-accent3">{g.hex ?? g.digit ?? g.val}</span>
                )).reduce((acc: React.ReactNode[], el, i) => i === 0 ? [el] : [...acc, <span key={`sep${i}`} className="text-muted"> + </span>, el], [])}
                {' '}= <span className="font-mono text-accent3 font-bold">{dirResult.result}</span>
              </div>
              <div className="bg-surface2 rounded-lg p-4 text-center">
                <p className="text-muted text-xs mb-1">Resultado</p>
                <p className="text-3xl font-bold font-mono text-accent3">{dirResult.result}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HU-1.2: Fraccionario ── */}
      {tab === 'fraccionaria' && (
        <div className="space-y-4">
          <p className="text-muted text-sm">Método: Multiplicaciones Sucesivas — multiplica por 2, el entero del producto es el bit, repite con la parte fraccionaria.</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-muted mb-1">Fracción decimal (0 &lt; x &lt; 1)</label>
              <input type="text" value={fracInput} onChange={e => setFracInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runFrac()} placeholder="ej: 0.6875"
                className="bg-surface2 border border-border rounded px-3 py-2 text-text font-mono w-36 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Bits máximos: <span className="text-accent">{fracBits}</span></label>
              <input type="range" min={4} max={32} value={fracBits} onChange={e => setFracBits(Number(e.target.value))}
                className="w-32 block" />
            </div>
            <button onClick={runFrac} className="bg-accent hover:bg-accent/80 text-white px-6 py-2 rounded font-semibold transition-colors">
              Convertir
            </button>
          </div>
          <ErrorMsg msg={fracErr} />
          {fracResult && (
            <div className="space-y-4 mt-2">
              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface2">
                    <tr className="text-muted">
                      <th className="text-left px-3 py-2 w-16">Paso</th>
                      <th className="text-left px-3 py-2">Fracción</th>
                      <th className="text-left px-3 py-2">× 2 =</th>
                      <th className="text-left px-3 py-2">Parte entera</th>
                      <th className="text-left px-3 py-2 text-accent2">Bit ↓</th>
                      <th className="text-left px-3 py-2 text-muted">Explicación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fracResult.steps.map((s, i) => {
                      const intPart = Math.floor(s.product)
                      const fracPart = s.product - intPart
                      return (
                        <tr key={i} className={`border-t border-border hover:bg-surface2/50 ${fracPart === 0 ? 'bg-accent3/5' : ''}`}>
                          <td className="px-3 py-2 text-muted text-xs">{s.step}</td>
                          <td className="px-3 py-2 font-mono text-text text-xs">{s.frac.toFixed(8)}</td>
                          <td className="px-3 py-2 font-mono text-text text-xs">{s.product.toFixed(8)}</td>
                          <td className="px-3 py-2 font-mono text-muted text-center">{intPart}</td>
                          <td className="px-3 py-2 font-mono font-bold text-accent2 text-lg text-center">{s.bit}</td>
                          <td className="px-3 py-2 text-xs text-muted">
                            {fracPart === 0
                              ? 'Fracción = 0 → termina exactamente'
                              : `Parte entera = ${intPart} → bit ${intPart}; continuar con 0.${String(s.product.toFixed(8)).split('.')[1]}`}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {fracResult.isPeriodic && (
                <div className="bg-accent4/10 border border-accent4/30 rounded-lg p-3 text-sm text-accent4">
                  Fracción periódica detectada — la parte fraccionaria nunca llega a 0. El patrón se repite desde el bit {fracResult.periodStart + 1}. Se trunca a {fracBits} bits.
                </div>
              )}
              <div className="bg-surface2 rounded-lg p-3 text-sm text-muted">
                <span className="text-accent2 font-semibold">Leer los bits de arriba hacia abajo</span> (del paso 1 al {fracResult.steps.length}):
                <span className="font-mono text-accent3 ml-2 text-base font-bold">{fracResult.resultStr}</span>
              </div>
              <div className="bg-surface2 rounded-lg p-4 text-center">
                <p className="text-muted text-xs mb-1">0.{fracInput.split('.')[1] ?? fracInput}<sub>10</sub> en binario</p>
                <p className="text-2xl font-bold font-mono text-accent3">{fracResult.resultStr}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
