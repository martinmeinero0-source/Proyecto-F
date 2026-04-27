'use client'

import { useState } from 'react'

// ── Parity ─────────────────────────────────────────────────────────────────

function computeParity(bits: string, type: 'par' | 'impar'): { bit: number; ones: number } {
  const ones = bits.split('').filter(b => b === '1').length
  const parityBit = type === 'par' ? (ones % 2 === 0 ? 0 : 1) : (ones % 2 === 0 ? 1 : 0)
  return { bit: parityBit, ones }
}

function checkParity(bits: string, type: 'par' | 'impar'): boolean {
  const ones = bits.split('').filter(b => b === '1').length
  return type === 'par' ? ones % 2 === 0 : ones % 2 !== 0
}

// ── Hamming ─────────────────────────────────────────────────────────────────

function hammingEncode(data: string): { encoded: string; parityPositions: number[]; steps: { pos: number; covers: number[]; count: number; bit: number }[] } {
  const m = data.length
  let r = 0
  while (Math.pow(2, r) < m + r + 1) r++

  const n = m + r
  const encoded = new Array(n + 1).fill(0) // 1-indexed

  // Place data bits at non-power-of-2 positions
  let dataIdx = 0
  for (let i = 1; i <= n; i++) {
    if ((i & (i - 1)) !== 0) {
      encoded[i] = parseInt(data[dataIdx++], 10)
    }
  }

  const parityPositions: number[] = []
  for (let i = 0; i < r; i++) parityPositions.push(Math.pow(2, i))

  // Compute parity bits (even parity)
  const steps: { pos: number; covers: number[]; count: number; bit: number }[] = []
  for (const p of parityPositions) {
    const covers: number[] = []
    for (let i = 1; i <= n; i++) {
      if (i !== p && (i & p) !== 0) covers.push(i)
    }
    const count = covers.filter(i => encoded[i] === 1).length
    const bit = count % 2
    encoded[p] = bit
    steps.push({ pos: p, covers, count, bit })
  }

  return { encoded: encoded.slice(1).join(''), parityPositions, steps }
}

function hammingDetect(received: string): { syndrome: number; errorPos: number; corrected: string } {
  const n = received.length
  const bits = [0, ...received.split('').map(Number)] // 1-indexed

  let syndrome = 0
  let r = 0
  while (Math.pow(2, r) < n + 1) r++

  for (let i = 0; i < r; i++) {
    const p = Math.pow(2, i)
    let count = 0
    for (let j = 1; j <= n; j++) {
      if ((j & p) !== 0) count += bits[j]
    }
    if (count % 2 !== 0) syndrome += p
  }

  const corrected = [...bits.slice(1)]
  if (syndrome > 0 && syndrome <= n) {
    corrected[syndrome - 1] = corrected[syndrome - 1] === 0 ? 1 : 0
  }

  return { syndrome, errorPos: syndrome, corrected: corrected.join('') }
}

// ── CRC ─────────────────────────────────────────────────────────────────────

function crcDivide(dividend: string, divisor: string): { remainder: string; steps: { current: string; xored: string }[] } {
  const steps: { current: string; xored: string }[] = []
  let current = dividend.slice(0, divisor.length)
  let pos = divisor.length

  while (true) {
    const div = current[0] === '1' ? divisor : '0'.repeat(divisor.length)
    let xored = ''
    for (let i = 0; i < current.length; i++) {
      xored += (parseInt(current[i]) ^ parseInt(div[i])).toString()
    }
    steps.push({ current, xored })

    // Remove leading zeros
    let trimmed = xored.replace(/^0+/, '') || '0'
    if (pos >= dividend.length) {
      const remainder = xored.slice(-(divisor.length - 1)).padStart(divisor.length - 1, '0')
      return { remainder, steps }
    }
    trimmed += dividend[pos++]
    current = trimmed.padStart(divisor.length, '0').slice(-divisor.length)
    while (current.length < divisor.length && pos < dividend.length) {
      current += dividend[pos++]
    }
  }
}

// ── Component ───────────────────────────────────────────────────────────────

type Tab = 'paridad' | 'hamming' | 'crc'

export default function CalculadoraErrores() {
  const [tab, setTab] = useState<Tab>('paridad')

  // Parity state
  const [parBits, setParBits] = useState('')
  const [parType, setParType] = useState<'par' | 'impar'>('par')
  const [parMode, setParMode] = useState<'agregar' | 'verificar'>('agregar')
  const [parResult, setParResult] = useState<{ bit?: number; ones: number; valid?: boolean } | null>(null)
  const [parError, setParError] = useState('')

  // Hamming encode state
  const [hamData, setHamData] = useState('')
  const [hamResult, setHamResult] = useState<ReturnType<typeof hammingEncode> | null>(null)
  const [hamError, setHamError] = useState('')

  // Hamming detect state
  const [hamReceived, setHamReceived] = useState('')
  const [hamDetect, setHamDetect] = useState<ReturnType<typeof hammingDetect> | null>(null)
  const [hamDetectError, setHamDetectError] = useState('')

  // CRC state
  const [crcData, setCrcData] = useState('')
  const [crcPoly, setCrcPoly] = useState('1011')
  const [crcResult, setCrcResult] = useState<{ transmitted: string; remainder: string; steps: { current: string; xored: string }[] } | null>(null)
  const [crcError, setCrcError] = useState('')

  function isBinaryStr(s: string) { return /^[01]+$/.test(s) }

  function computePar() {
    if (!isBinaryStr(parBits) || parBits.length === 0) { setParError('Solo dígitos 0 y 1'); setParResult(null); return }
    setParError('')
    if (parMode === 'agregar') {
      const r = computeParity(parBits, parType)
      setParResult(r)
    } else {
      const ones = parBits.split('').filter(b => b === '1').length
      const valid = checkParity(parBits, parType)
      setParResult({ ones, valid })
    }
  }

  function encodeHamming() {
    if (!isBinaryStr(hamData) || hamData.length === 0) { setHamError('Solo dígitos 0 y 1'); setHamResult(null); return }
    if (hamData.length > 11) { setHamError('Máximo 11 bits de datos'); setHamResult(null); return }
    setHamError('')
    setHamResult(hammingEncode(hamData))
  }

  function detectHamming() {
    if (!isBinaryStr(hamReceived) || hamReceived.length === 0) { setHamDetectError('Solo dígitos 0 y 1'); setHamDetect(null); return }
    setHamDetectError('')
    setHamDetect(hammingDetect(hamReceived))
  }

  function computeCRC() {
    if (!isBinaryStr(crcData) || crcData.length === 0) { setCrcError('Solo dígitos 0 y 1 en datos'); setCrcResult(null); return }
    if (!isBinaryStr(crcPoly) || crcPoly.length < 2) { setCrcError('Polinomio debe tener ≥ 2 bits'); setCrcResult(null); return }
    setCrcError('')
    const appended = crcData + '0'.repeat(crcPoly.length - 1)
    const { remainder, steps } = crcDivide(appended, crcPoly)
    const transmitted = crcData + remainder
    setCrcResult({ transmitted, remainder, steps })
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'paridad', label: 'Paridad' },
    { id: 'hamming', label: 'Hamming' },
    { id: 'crc',     label: 'CRC' },
  ]

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-accent mb-2">Calculadora de Detección y Corrección de Errores</h2>
      <p className="text-muted text-sm mb-6">HU-4.2 · HU-4.3 — Épica 4</p>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 text-sm font-semibold rounded-t-md transition-colors ${
              tab === t.id ? 'bg-accent text-bg' : 'text-muted hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Parity tab ── */}
      {tab === 'paridad' && (
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase tracking-wide">Cadena de bits</label>
              <input
                type="text"
                value={parBits}
                onChange={e => setParBits(e.target.value.replace(/[^01]/g, ''))}
                onKeyDown={e => e.key === 'Enter' && computePar()}
                placeholder="1011001"
                className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-48 focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase tracking-wide">Tipo</label>
              <select value={parType} onChange={e => setParType(e.target.value as 'par' | 'impar')}
                className="bg-bg border border-border text-text px-3 py-2 rounded-md focus:outline-none focus:border-accent">
                <option value="par">Paridad PAR</option>
                <option value="impar">Paridad IMPAR</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase tracking-wide">Modo</label>
              <select value={parMode} onChange={e => setParMode(e.target.value as 'agregar' | 'verificar')}
                className="bg-bg border border-border text-text px-3 py-2 rounded-md focus:outline-none focus:border-accent">
                <option value="agregar">Agregar bit de paridad</option>
                <option value="verificar">Verificar trama</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={computePar} className="bg-accent text-bg font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
                Calcular
              </button>
            </div>
          </div>
          {parError && <p className="text-accent4 text-sm mb-3">{parError}</p>}
          {parResult && (
            <div className="bg-bg rounded-md p-4 space-y-3 text-sm">
              <p className="text-xs text-accent2 font-semibold uppercase tracking-wide mb-2">Paso a paso</p>

              {/* Paso 1 */}
              <div className="flex gap-3">
                <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 1</span>
                <div>
                  <p className="text-text">Contar los unos en la cadena</p>
                  <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1 text-accent3">
                    {parBits.split('').map((b, i) => (
                      <span key={i} className={b === '1' ? 'text-accent3 font-bold' : 'text-muted'}>{b}</span>
                    ))}
                    {' '}→ {parResult.ones} uno{parResult.ones !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-3">
                <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 2</span>
                <div>
                  <p className="text-text">
                    Paridad <span className="font-semibold">{parType.toUpperCase()}</span> requiere cantidad{' '}
                    <span className="font-semibold">{parType === 'par' ? 'PAR' : 'IMPAR'}</span> de unos en la trama final
                  </p>
                  <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1 text-muted">
                    {parResult.ones} es {parResult.ones % 2 === 0 ? 'PAR' : 'IMPAR'}
                  </p>
                </div>
              </div>

              {parMode === 'agregar' && parResult.bit !== undefined && (
                <>
                  <div className="flex gap-3">
                    <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 3</span>
                    <div>
                      <p className="text-text">
                        {parType === 'par'
                          ? parResult.ones % 2 === 0
                            ? `${parResult.ones} unos ya es PAR → no hay que agregar → bit de paridad = 0`
                            : `${parResult.ones} unos es IMPAR → hay que agregar un 1 para hacer par → bit de paridad = 1`
                          : parResult.ones % 2 !== 0
                          ? `${parResult.ones} unos ya es IMPAR → bit de paridad = 0`
                          : `${parResult.ones} unos es PAR → hay que agregar un 1 para hacer impar → bit de paridad = 1`}
                      </p>
                      <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1">
                        <span className="text-muted">bit paridad = </span>
                        <span className="text-accent3 font-bold text-base">{parResult.bit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 4</span>
                    <div>
                      <p className="text-text">Agregar el bit de paridad al final de la cadena</p>
                      <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1">
                        <span className="text-muted">{parBits}</span>
                        <span className="text-accent3 font-bold"> + {parResult.bit}</span>
                        <span className="text-muted"> → </span>
                        <span className="text-accent3 font-bold">{parBits + parResult.bit}</span>
                      </p>
                    </div>
                  </div>
                </>
              )}

              {parMode === 'verificar' && parResult.valid !== undefined && (
                <div className="flex gap-3">
                  <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 3</span>
                  <div>
                    <p className="text-text">
                      Verificar: ¿el total de unos ({parResult.ones}) cumple paridad {parType.toUpperCase()}?
                    </p>
                    <p className={`font-semibold mt-1 ${parResult.valid ? 'text-accent3' : 'text-accent4'}`}>
                      {parResult.valid
                        ? `✓ ${parResult.ones} es ${parType === 'par' ? 'PAR' : 'IMPAR'} → trama válida`
                        : `✗ ${parResult.ones} no es ${parType === 'par' ? 'PAR' : 'IMPAR'} → error detectado`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Hamming tab ── */}
      {tab === 'hamming' && (
        <div className="space-y-6">
          {/* Encode */}
          <div>
            <h3 className="text-accent2 font-semibold mb-3">Codificación Hamming</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted uppercase tracking-wide">Bits de datos</label>
                <input type="text" value={hamData}
                  onChange={e => setHamData(e.target.value.replace(/[^01]/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && encodeHamming()}
                  placeholder="1011"
                  className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-40 focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-end">
                <button onClick={encodeHamming} className="bg-accent text-bg font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
                  Codificar
                </button>
              </div>
            </div>
            {hamError && <p className="text-accent4 text-sm mb-3">{hamError}</p>}
            {hamResult && (
              <div className="bg-bg rounded-md p-4 space-y-3 text-sm">
                {/* Estructura */}
                <div className="flex gap-3">
                  <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 1</span>
                  <div>
                    <p className="text-text">
                      m={hamData.length} bits de datos → se necesitan r={hamResult.parityPositions.length} bits de paridad
                      → código de n={hamData.length + hamResult.parityPositions.length} bits
                    </p>
                    <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1 text-muted">
                      Posiciones de paridad (potencias de 2): {hamResult.parityPositions.map(p => (
                        <span key={p} className="text-accent2 font-bold mr-1">P{p}</span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 2</span>
                  <p className="text-text">
                    Calcular cada bit de paridad (paridad PAR): P<sub>k</sub> cubre todas las posiciones
                    cuya representación binaria tiene el bit k en 1
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface2">
                        <th className="text-left text-muted py-2 pr-3 pl-2">Bit P</th>
                        <th className="text-left text-muted py-2 pr-3">Posiciones cubiertas</th>
                        <th className="text-left text-muted py-2 pr-3">Unos cubiertos</th>
                        <th className="text-left text-muted py-2 pr-3">¿Par o impar?</th>
                        <th className="text-left text-muted py-2">Bit asignado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hamResult.steps.map(s => (
                        <tr key={s.pos} className="border-b border-border last:border-0">
                          <td className="py-2 pr-3 pl-2 font-mono text-accent2 font-bold">P{s.pos}</td>
                          <td className="py-2 pr-3 font-mono text-muted">{s.covers.join(', ')}</td>
                          <td className="py-2 pr-3 font-mono text-text">{s.count}</td>
                          <td className="py-2 pr-3 text-muted">
                            {s.count} es {s.count % 2 === 0 ? 'par' : 'impar'} →
                            {s.count % 2 === 0 ? ' paridad ya correcta' : ' necesita ajuste'}
                          </td>
                          <td className="py-2 font-mono font-bold text-accent3">{s.bit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3">
                  <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 3</span>
                  <div>
                    <p className="text-text">Código Hamming final (insertar bits de paridad en sus posiciones)</p>
                    <p className="font-mono text-accent3 text-base tracking-widest mt-1">{hamResult.encoded}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detect & Correct */}
          <div>
            <h3 className="text-accent2 font-semibold mb-3">Detección y Corrección de Errores</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted uppercase tracking-wide">Código recibido</label>
                <input type="text" value={hamReceived}
                  onChange={e => setHamReceived(e.target.value.replace(/[^01]/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && detectHamming()}
                  placeholder="0110110"
                  className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-48 focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-end">
                <button onClick={detectHamming} className="bg-accent text-bg font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
                  Detectar
                </button>
              </div>
            </div>
            {hamDetectError && <p className="text-accent4 text-sm mb-3">{hamDetectError}</p>}
            {hamDetect && (
              <div className="bg-bg rounded-md p-4 space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 1</span>
                  <p className="text-text">Recalcular cada bit de paridad sobre el código recibido y hacer XOR con el bit original</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 2</span>
                  <div>
                    <p className="text-text">
                      Síndrome = suma de posiciones de paridad con error (en binario indica la posición del bit erróneo)
                    </p>
                    <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1">
                      <span className="text-muted">Síndrome = </span>
                      <span className="text-accent2 font-bold">{hamDetect.syndrome}</span>
                      {hamDetect.syndrome > 0 && (
                        <span className="text-muted ml-2">
                          = {hamDetect.syndrome.toString(2).padStart(4, '0')} en binario
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 3</span>
                  <div>
                    {hamDetect.errorPos === 0 ? (
                      <p className="text-accent3 font-semibold">Síndrome = 0 → sin errores detectados ✓</p>
                    ) : (
                      <>
                        <p className="text-accent4 font-semibold">
                          Síndrome = {hamDetect.errorPos} → error en posición {hamDetect.errorPos} → invertir ese bit
                        </p>
                        <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1">
                          <span className="text-muted">Recibido:  </span>
                          <span className="font-mono text-text">{hamReceived}</span>
                          <br />
                          <span className="text-muted">Corregido: </span>
                          <span className="font-mono text-accent3">{hamDetect.corrected}</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CRC tab ── */}
      {tab === 'crc' && (
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase tracking-wide">Datos (binario)</label>
              <input type="text" value={crcData}
                onChange={e => setCrcData(e.target.value.replace(/[^01]/g, ''))}
                onKeyDown={e => e.key === 'Enter' && computeCRC()}
                placeholder="110010"
                className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-40 focus:outline-none focus:border-accent" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase tracking-wide">Polinomio generador</label>
              <input type="text" value={crcPoly}
                onChange={e => setCrcPoly(e.target.value.replace(/[^01]/g, ''))}
                onKeyDown={e => e.key === 'Enter' && computeCRC()}
                placeholder="1011"
                className="bg-bg border border-border text-text font-mono px-4 py-2 rounded-md w-32 focus:outline-none focus:border-accent" />
            </div>
            <div className="flex items-end">
              <button onClick={computeCRC} className="bg-accent text-bg font-bold px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
                Calcular CRC
              </button>
            </div>
          </div>
          {crcError && <p className="text-accent4 text-sm mb-3">{crcError}</p>}
          {crcResult && (
            <div className="bg-bg rounded-md p-4 space-y-3 text-sm">
              {/* Paso 1 */}
              <div className="flex gap-3">
                <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 1</span>
                <div>
                  <p className="text-text">
                    Agregar (grado del polinomio) = {crcPoly.length - 1} ceros al final de los datos
                  </p>
                  <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1">
                    <span className="text-text">{crcData}</span>
                    <span className="text-accent4">{'0'.repeat(crcPoly.length - 1)}</span>
                    <span className="text-muted ml-2">← dividendo</span>
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-3">
                <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 2</span>
                <div>
                  <p className="text-text">
                    División módulo-2 (XOR): si el MSB del grupo actual es 1 → XOR con el polinomio;
                    si es 0 → XOR con ceros (desplazar)
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="text-xs w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface2">
                      <th className="text-left text-muted py-2 px-3 w-10">#</th>
                      <th className="text-left text-muted py-2 pr-6">Dividendo actual</th>
                      <th className="text-left text-muted py-2 pr-4">XOR con</th>
                      <th className="text-left text-muted py-2">Resultado XOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crcResult.steps.map((s, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2 px-3 text-muted">{i + 1}</td>
                        <td className="py-2 pr-6 font-mono text-text">{s.current}</td>
                        <td className="py-2 pr-4 font-mono text-muted text-xs">
                          {s.current[0] === '1' ? crcPoly : '0'.repeat(crcPoly.length)}
                          <span className="text-muted ml-1">
                            ({s.current[0] === '1' ? 'MSB=1→usar polinomio' : 'MSB=0→ceros'})
                          </span>
                        </td>
                        <td className="py-2 font-mono text-accent2">{s.xored}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paso 3 */}
              <div className="flex gap-3">
                <span className="text-accent2 font-bold text-xs w-14 shrink-0 pt-0.5">Paso 3</span>
                <div>
                  <p className="text-text">
                    El último resto es el FCS ({crcPoly.length - 1} bits). Se adjunta a los datos originales.
                  </p>
                  <p className="font-mono text-xs mt-1 bg-surface2 rounded px-2 py-1">
                    <span className="text-muted">FCS = </span>
                    <span className="text-accent3 font-bold">{crcResult.remainder}</span>
                    <br />
                    <span className="text-muted">Transmitir: </span>
                    <span className="text-text">{crcData}</span>
                    <span className="text-accent3 font-bold">{crcResult.remainder}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
