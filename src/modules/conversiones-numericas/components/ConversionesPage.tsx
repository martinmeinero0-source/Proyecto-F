'use client'

import { useState } from 'react'

const HEX_DIGITS = '0123456789ABCDEF'

interface DivisionStep {
  dividend: number
  divisor: number
  quotient: number
  remainder: number
}

interface HU11Result {
  original: number
  base: number
  steps: DivisionStep[]
  result: string
  resultDigits: string[]
}

export default function ConversionesPage() {
  const [activeTab, setActiveTab] = useState<'hu11' | 'hu13' | 'hu14' | 'hu12'>('hu11')

  // HU-1.1
  const [hu11Input, setHu11Input] = useState('26586')
  const [hu11Base, setHu11Base] = useState('16')
  const [hu11Result, setHu11Result] = useState<HU11Result | null>(null)
  const [hu11Error, setHu11Error] = useState('')

  // HU-1.3
  const [hu13Input, setHu13Input] = useState('11111101001')
  const [hu13Base, setHu13Base] = useState('2')
  const [hu13Result, setHu13Result] = useState<any>(null)
  const [hu13Error, setHu13Error] = useState('')

  // HU-1.4
  const [hu14Input, setHu14Input] = useState('11111101001')
  const [hu14Type, setHu14Type] = useState('bin2hex')
  const [hu14Result, setHu14Result] = useState<any>(null)
  const [hu14Error, setHu14Error] = useState('')

  // HU-1.2
  const [hu12Input, setHu12Input] = useState('0.1')
  const [hu12Bits, setHu12Bits] = useState('12')
  const [hu12Result, setHu12Result] = useState<any>(null)
  const [hu12Error, setHu12Error] = useState('')

  // ═══════════════════════════════════════════════
  // HU-1.1: DIVISIONES SUCESIVAS
  // ═══════════════════════════════════════════════
  const doHU11 = () => {
    setHu11Error('')
    const n = parseInt(hu11Input)
    const base = parseInt(hu11Base)

    if (isNaN(n) || n < 0) {
      setHu11Error('Ingresá un número entero positivo.')
      return
    }

    if (n === 0) {
      setHu11Result({
        original: 0,
        base,
        steps: [],
        result: '0',
        resultDigits: ['0'],
      })
      return
    }

    const steps: DivisionStep[] = []
    let num = n

    while (num > 0) {
      const quotient = Math.floor(num / base)
      const remainder = num % base
      steps.push({ dividend: num, divisor: base, quotient, remainder })
      num = quotient
    }

    const resultDigits = steps.map((s) => HEX_DIGITS[s.remainder]).reverse()
    const result = resultDigits.join('')

    setHu11Result({ original: n, base, steps, result, resultDigits })
  }

  // ═══════════════════════════════════════════════
  // HU-1.3: POTENCIAS
  // ═══════════════════════════════════════════════
  const doHU13 = () => {
    setHu13Error('')
    const input = hu13Input.trim().toUpperCase()
    const base = parseInt(hu13Base)

    if (!input) {
      setHu13Error('Ingresá un número.')
      return
    }

    const digits = input.split('').map((c) => {
      c = c.toUpperCase()
      if (c >= '0' && c <= '9') return parseInt(c)
      if (c >= 'A' && c <= 'F') return c.charCodeAt(0) - 55
      return -1
    })

    for (let i = 0; i < digits.length; i++) {
      if (digits[i] < 0 || digits[i] >= base) {
        setHu13Error(`Dígito inválido para base ${base}`)
        return
      }
    }

    const len = digits.length
    const terms = []
    let total = 0

    digits.forEach((d, i) => {
      const exp = len - 1 - i
      let power = 1
      for (let j = 0; j < exp; j++) {
        power *= base
      }
      const val = d * power
      total += val
      terms.push({
        digit: d,
        digitStr: HEX_DIGITS[d],
        base,
        exp,
        power,
        val,
      })
    })

    setHu13Result({ input, base, terms, result: total })
  }

  // ═══════════════════════════════════════════════
  // HU-1.4: CONVERSIONES DIRECTAS
  // ═══════════════════════════════════════════════
  const doHU14 = () => {
    setHu14Error('')
    const input = hu14Input.trim()
    if (!input) {
      setHu14Error('Ingresá un valor.')
      return
    }

    try {
      let result
      if (hu14Type === 'bin2oct') {
        result = bin2oct(input)
      } else if (hu14Type === 'bin2hex') {
        result = bin2hex(input)
      } else if (hu14Type === 'oct2bin') {
        result = oct2bin(input)
      } else {
        result = hex2bin(input)
      }
      setHu14Result(result)
    } catch (err: any) {
      setHu14Error(err.message)
    }
  }

  function bin2oct(bin: string) {
    bin = bin.replace(/\s/g, '')
    for (let c of bin) if (c !== '0' && c !== '1') throw new Error('Solo 0 y 1 permitidos')
    while (bin.length % 3 !== 0) bin = '0' + bin
    const groups = []
    for (let i = 0; i < bin.length; i += 3) {
      const g = bin.slice(i, i + 3)
      const val = parseInt(g[0]) * 4 + parseInt(g[1]) * 2 + parseInt(g[2]) * 1
      groups.push({ bits: g, val })
    }
    return { groups, result: groups.map((g) => g.val).join(''), groupSize: 3, from: 'bin', to: 'oct' }
  }

  function bin2hex(bin: string) {
    bin = bin.replace(/\s/g, '')
    for (let c of bin) if (c !== '0' && c !== '1') throw new Error('Solo 0 y 1 permitidos')
    while (bin.length % 4 !== 0) bin = '0' + bin
    const groups = []
    for (let i = 0; i < bin.length; i += 4) {
      const g = bin.slice(i, i + 4)
      const val = parseInt(g[0]) * 8 + parseInt(g[1]) * 4 + parseInt(g[2]) * 2 + parseInt(g[3]) * 1
      groups.push({ bits: g, val, hex: HEX_DIGITS[val] })
    }
    return { groups, result: groups.map((g) => g.hex).join(''), groupSize: 4, from: 'bin', to: 'hex' }
  }

  function oct2bin(oct: string) {
    oct = oct.replace(/\s/g, '').toUpperCase()
    for (let c of oct) {
      const d = parseInt(c)
      if (isNaN(d) || d > 7) throw new Error(`Dígito inválido para octal`)
    }
    const groups = []
    for (let c of oct) {
      const d = parseInt(c)
      const b2 = Math.floor(d / 4)
      const r2 = d % 4
      const b1 = Math.floor(r2 / 2)
      const b0 = r2 % 2
      const manualBits = `${b2}${b1}${b0}`
      groups.push({ bits: manualBits, val: d, digit: c })
    }
    return { groups, result: groups.map((g) => g.bits).join(''), groupSize: 3, from: 'oct', to: 'bin' }
  }

  function hex2bin(hex: string) {
    hex = hex.replace(/\s/g, '').toUpperCase()
    const groups = []
    for (let c of hex) {
      let d = -1
      if (c >= '0' && c <= '9') d = parseInt(c)
      else if (c >= 'A' && c <= 'F') d = c.charCodeAt(0) - 55
      if (d < 0) throw new Error(`Dígito hexadecimal inválido`)
      const b3 = Math.floor(d / 8)
      const r3 = d % 8
      const b2 = Math.floor(r3 / 4)
      const r2 = r3 % 4
      const b1 = Math.floor(r2 / 2)
      const b0 = r2 % 2
      const manualBits = `${b3}${b2}${b1}${b0}`
      groups.push({ bits: manualBits, val: d, digit: c })
    }
    return { groups, result: groups.map((g) => g.bits).join(''), groupSize: 4, from: 'hex', to: 'bin' }
  }

  // ═══════════════════════════════════════════════
  // HU-1.2: DECIMAL FRACCIONARIO
  // ═══════════════════════════════════════════════
  const doHU12 = () => {
    setHu12Error('')
    const n = parseFloat(hu12Input)
    const maxBits = parseInt(hu12Bits)

    if (isNaN(n) || n <= 0 || n >= 1) {
      setHu12Error('Ingresá un número entre 0 y 1 (exclusivo), ej: 0.1')
      return
    }

    const steps = []
    const seen = new Map<string, number>()
    let isPeriodic = false
    let periodStart = -1
    let frac = n

    for (let i = 0; i < maxBits; i++) {
      const fracStr = frac.toFixed(15)
      if (seen.has(fracStr)) {
        isPeriodic = true
        periodStart = seen.get(fracStr)!
        break
      }
      seen.set(fracStr, i)

      const product = frac * 2
      const bit = product >= 1 ? 1 : 0
      const newFrac = product >= 1 ? product - 1 : product
      steps.push({ step: i + 1, frac, product, bit, newFrac })
      frac = newFrac
      if (newFrac === 0) break
    }

    const bits = steps.map((s) => s.bit)
    let resultStr
    if (isPeriodic) {
      const nonPeriodic = bits.slice(0, periodStart).join('')
      const periodic = bits.slice(periodStart).join('')
      resultStr = `0.${nonPeriodic}(${periodic})…`
    } else {
      resultStr = `0.${bits.join('')}`
    }

    setHu12Result({
      input: n,
      maxBits,
      steps,
      bits,
      isPeriodic,
      periodStart,
      resultStr,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-400 mb-2">
          Conversión Numérica Multibase
        </h1>
        <p className="text-slate-400 mb-8">
          Épica 1: Conversión entre bases decimal, binaria, octal y hexadecimal
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'hu11' as const, label: 'HU-1.1: Decimal → Bases' },
            { id: 'hu13' as const, label: 'HU-1.3: Bases → Decimal' },
            { id: 'hu14' as const, label: 'HU-1.4: Directas' },
            { id: 'hu12' as const, label: 'HU-1.2: Fraccionario' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* HU-1.1 */}
        {activeTab === 'hu11' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">HU-1.1: Decimal → Otras Bases</h2>
              <p className="text-slate-400 mb-6">
                Método de Divisiones Sucesivas: se divide el número entre la base de destino y se leen los residuos de abajo hacia arriba.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Número decimal</label>
                  <input
                    type="number"
                    value={hu11Input}
                    onChange={(e) => setHu11Input(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    placeholder="ej. 26586"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Base destino</label>
                  <select
                    value={hu11Base}
                    onChange={(e) => setHu11Base(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="2">Binario (2)</option>
                    <option value="8">Octal (8)</option>
                    <option value="16">Hexadecimal (16)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={doHU11}
                    className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors"
                  >
                    Convertir
                  </button>
                </div>
              </div>

              {hu11Error && <div className="p-3 bg-red-900 text-red-200 rounded">{hu11Error}</div>}

              {hu11Result && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-slate-400 text-sm mb-2">Resultado</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">
                      {hu11Result.original}₁₀ → {hu11Result.result}
                      <sub className="text-lg">{hu11Result.base}</sub>
                    </p>
                  </div>

                  {hu11Result.steps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-300 mb-4">Pasos — Divisiones Sucesivas</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-600">
                              <th className="px-3 py-2 text-left text-slate-400">Dividendo</th>
                              <th className="px-3 py-2 text-left text-slate-400">Divisor</th>
                              <th className="px-3 py-2 text-left text-slate-400">Cociente</th>
                              <th className="px-3 py-2 text-left text-amber-400">Residuo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hu11Result.steps.map((step, i) => (
                              <tr key={i} className="border-b border-slate-700 hover:bg-slate-700">
                                <td className="px-3 py-2">{step.dividend}</td>
                                <td className="px-3 py-2">{step.divisor}</td>
                                <td className="px-3 py-2">{step.quotient}</td>
                                <td className="px-3 py-2 font-bold text-amber-400">
                                  {HEX_DIGITS[step.remainder]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HU-1.3 */}
        {activeTab === 'hu13' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">HU-1.3: Bases → Decimal</h2>
              <p className="text-slate-400 mb-6">
                Método de Potencias: cada dígito se multiplica por la base elevada a su posición, sumando todos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Número a convertir</label>
                  <input
                    type="text"
                    value={hu13Input}
                    onChange={(e) => setHu13Input(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white font-mono"
                    placeholder="ej. 11111101001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Base origen</label>
                  <select
                    value={hu13Base}
                    onChange={(e) => setHu13Base(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="2">Binario (2)</option>
                    <option value="8">Octal (8)</option>
                    <option value="16">Hexadecimal (16)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={doHU13}
                    className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors"
                  >
                    Convertir
                  </button>
                </div>
              </div>

              {hu13Error && <div className="p-3 bg-red-900 text-red-200 rounded">{hu13Error}</div>}

              {hu13Result && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-slate-400 text-sm mb-2">Resultado</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">
                      {hu13Result.input}
                      <sub className="text-lg">{hu13Result.base}</sub> → {hu13Result.result}₁₀
                    </p>
                  </div>

                  {hu13Result.terms.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-300 mb-4">Desarrollo Polinomial</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-600">
                              <th className="px-3 py-2 text-left text-slate-400">Dígito</th>
                              <th className="px-3 py-2 text-left text-slate-400">Base^pos</th>
                              <th className="px-3 py-2 text-left text-slate-400">Valor potencia</th>
                              <th className="px-3 py-2 text-left text-amber-400">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hu13Result.terms.map((term: any, i: number) => (
                              <tr key={i} className="border-b border-slate-700 hover:bg-slate-700">
                                <td className="px-3 py-2 font-bold text-emerald-400">{term.digitStr}</td>
                                <td className="px-3 py-2">
                                  {term.base}
                                  <sup>{term.exp}</sup>
                                </td>
                                <td className="px-3 py-2">{term.power}</td>
                                <td className="px-3 py-2 font-bold text-amber-400">{term.val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HU-1.4 */}
        {activeTab === 'hu14' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">HU-1.4: Conversiones Directas</h2>
              <p className="text-slate-400 mb-6">
                Binario ↔ Octal (3 bits) · Binario ↔ Hexadecimal (4 bits). Sin pasar por decimal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Valor de entrada</label>
                  <input
                    type="text"
                    value={hu14Input}
                    onChange={(e) => setHu14Input(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white font-mono"
                    placeholder="ej. 11111101001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Tipo de conversión</label>
                  <select
                    value={hu14Type}
                    onChange={(e) => setHu14Type(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="bin2oct">Binario → Octal</option>
                    <option value="bin2hex">Binario → Hexadecimal</option>
                    <option value="oct2bin">Octal → Binario</option>
                    <option value="hex2bin">Hexadecimal → Binario</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={doHU14}
                    className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors"
                  >
                    Convertir
                  </button>
                </div>
              </div>

              {hu14Error && <div className="p-3 bg-red-900 text-red-200 rounded">{hu14Error}</div>}

              {hu14Result && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-slate-400 text-sm mb-2">Resultado</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">{hu14Result.result}</p>
                  </div>

                  {hu14Result.groups.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-300 mb-4">Agrupación de bits</h3>
                      <div className="flex flex-wrap gap-4">
                        {hu14Result.groups.map((group: any, i: number) => (
                          <div key={i} className="text-center">
                            <div className="font-mono text-sm bg-slate-700 px-3 py-2 rounded mb-2">
                              {group.bits}
                            </div>
                            <div className="text-amber-400 font-bold">
                              {group.hex || group.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HU-1.2 */}
        {activeTab === 'hu12' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">HU-1.2: Decimal Fraccionario → Binario</h2>
              <p className="text-slate-400 mb-6">
                Método de Multiplicaciones Sucesivas: la parte fraccionaria se multiplica por 2. El dígito entero forma el número binario.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Número (0 &lt; x &lt; 1)</label>
                  <input
                    type="text"
                    value={hu12Input}
                    onChange={(e) => setHu12Input(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    placeholder="ej. 0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Precisión máx (bits)</label>
                  <input
                    type="number"
                    value={hu12Bits}
                    onChange={(e) => setHu12Bits(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    min="4"
                    max="32"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={doHU12}
                    className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors"
                  >
                    Convertir
                  </button>
                </div>
              </div>

              {hu12Error && <div className="p-3 bg-red-900 text-red-200 rounded">{hu12Error}</div>}

              {hu12Result && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-slate-400 text-sm mb-2">Resultado</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">
                      {hu12Result.input}₁₀ → {hu12Result.resultStr}₂
                    </p>
                  </div>

                  {hu12Result.isPeriodic && (
                    <div className="p-4 bg-red-900 text-red-200 rounded">
                      ⚠ <strong>Fracción periódica detectada</strong> - No puede representarse exactamente en binario.
                    </div>
                  )}

                  {hu12Result.steps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-300 mb-4">Multiplicaciones Sucesivas × 2</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-600">
                              <th className="px-3 py-2 text-left text-slate-400">#</th>
                              <th className="px-3 py-2 text-left text-slate-400">Fracción</th>
                              <th className="px-3 py-2 text-left text-slate-400">Producto</th>
                              <th className="px-3 py-2 text-left text-amber-400">Bit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hu12Result.steps.map((step: any, i: number) => (
                              <tr
                                key={i}
                                className={`border-b border-slate-700 hover:bg-slate-700 ${
                                  hu12Result.isPeriodic && i >= hu12Result.periodStart ? 'bg-red-900 bg-opacity-20' : ''
                                }`}
                              >
                                <td className="px-3 py-2">{step.step}</td>
                                <td className="px-3 py-2">{step.frac.toFixed(10)}</td>
                                <td className="px-3 py-2">{step.product.toFixed(10)}</td>
                                <td className="px-3 py-2 font-bold text-amber-400">{step.bit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
