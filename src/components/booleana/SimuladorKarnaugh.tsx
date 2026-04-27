'use client'

import { useState, useMemo } from 'react'

// ── K-map config ──────────────────────────────────────────────────────────────

const GRAY1 = [0, 1]
const GRAY2 = [0, 1, 3, 2]

interface KCfg {
  vars: number; rows: number; cols: number
  rowVars: number; colVars: number
  rowGray: number[]; colGray: number[]
  vnames: string[]; rowVnames: string[]; colVnames: string[]
}

function getCfg(vars: number): KCfg {
  if (vars === 2) return { vars: 2, rows: 2, cols: 2, rowVars: 1, colVars: 1, rowGray: GRAY1, colGray: GRAY1, vnames: ['A','B'], rowVnames: ['A'], colVnames: ['B'] }
  if (vars === 3) return { vars: 3, rows: 2, cols: 4, rowVars: 1, colVars: 2, rowGray: GRAY1, colGray: GRAY2, vnames: ['A','B','C'], rowVnames: ['A'], colVnames: ['B','C'] }
  return { vars: 4, rows: 4, cols: 4, rowVars: 2, colVars: 2, rowGray: GRAY2, colGray: GRAY2, vnames: ['A','B','C','D'], rowVnames: ['A','B'], colVnames: ['C','D'] }
}

function cellMinterm(cfg: KCfg, r: number, c: number): number {
  return (cfg.rowGray[r] << cfg.colVars) | cfg.colGray[c]
}

// ── Simplification algorithm ──────────────────────────────────────────────────
// vals[m]: 0 = false, 1 = true, 2 = don't-care (X)

function findAllGroups(cfg: KCfg, vals: number[]): number[][] {
  const { rows, cols } = cfg
  const all: number[][] = []
  for (let rSpan = 1; rSpan <= rows; rSpan *= 2) {
    for (let cSpan = 1; cSpan <= cols; cSpan *= 2) {
      for (let r0 = 0; r0 < rows; r0++) {
        for (let c0 = 0; c0 < cols; c0++) {
          const mset = new Set<number>()
          let valid = true
          outer: for (let dr = 0; dr < rSpan; dr++) {
            for (let dc = 0; dc < cSpan; dc++) {
              const m = cellMinterm(cfg, (r0 + dr) % rows, (c0 + dc) % cols)
              if (vals[m] === 0) { valid = false; break outer }
              mset.add(m)
            }
          }
          if (valid && [...mset].some(m => vals[m] === 1))
            all.push([...mset].sort((a, b) => a - b))
        }
      }
    }
  }
  const seen = new Set<string>()
  return all.filter(g => { const k = g.join(','); if (seen.has(k)) return false; seen.add(k); return true })
}

function findPrimes(groups: number[][]): number[][] {
  return groups.filter(g => !groups.some(g2 => g2.length > g.length && g.every(m => g2.includes(m))))
}

function minCover(primes: number[][], ones: number[]): number[][] {
  if (!ones.length) return []
  const covered = new Set<number>()
  const selected: number[][] = []
  // Essential prime implicants
  for (const one of ones) {
    const opts = primes.filter(p => p.includes(one))
    if (opts.length === 1 && !selected.includes(opts[0])) {
      selected.push(opts[0])
      opts[0].forEach(m => covered.add(m))
    }
  }
  // Greedy cover for remaining
  let rem = ones.filter(m => !covered.has(m))
  while (rem.length > 0) {
    const best = [...primes]
      .filter(p => !selected.includes(p))
      .sort((a, b) =>
        b.filter(m => !covered.has(m) && ones.includes(m)).length -
        a.filter(m => !covered.has(m) && ones.includes(m)).length)[0]
    if (!best) break
    selected.push(best)
    best.forEach(m => covered.add(m))
    rem = ones.filter(m => !covered.has(m))
  }
  return selected
}

function groupToTerm(group: number[], cfg: KCfg): string {
  if (group.length === 1 << cfg.vars) return '1'
  const lits: string[] = []
  for (let bit = cfg.vars - 1; bit >= 0; bit--) {
    const bitVals = new Set(group.map(m => (m >> bit) & 1))
    if (bitVals.size === 1) {
      const varIdx = cfg.vars - 1 - bit
      lits.push([...bitVals][0] === 1 ? cfg.vnames[varIdx] : `¬${cfg.vnames[varIdx]}`)
    }
  }
  return lits.length ? lits.join('·') : '1'
}

// ── Colors ────────────────────────────────────────────────────────────────────

const GC = ['#5ef7a4','#f7c948','#f7635e','#4f8ef7','#f787e4','#f7a654','#87d7ff','#c4f787']
const GB = ['#5ef7a420','#f7c94820','#f7635e20','#4f8ef720','#f787e420','#f7a65420','#87d7ff20','#c4f78720']

// ── Component ─────────────────────────────────────────────────────────────────

export default function SimuladorKarnaugh() {
  const [vars, setVars]     = useState(3)
  const [vals, setVals]     = useState<number[]>(() => new Array(8).fill(0))
  const [result, setResult] = useState<{ cover: number[][]; primes: number[][] } | null>(null)
  const [hovG, setHovG]     = useState<number | null>(null)
  const [mintIn, setMintIn] = useState('')
  const [dcIn, setDcIn]     = useState('')
  const [err, setErr]       = useState('')

  const cfg = useMemo(() => getCfg(vars), [vars])

  function changeVars(v: number) {
    setVars(v); setVals(new Array(1 << v).fill(0))
    setResult(null); setMintIn(''); setDcIn(''); setErr('')
  }
  function cycleCell(m: number) {
    setVals(p => { const n = [...p]; n[m] = (n[m] + 1) % 3; return n })
    setResult(null)
  }
  function parseList(s: string): number[] | null {
    const max = 1 << vars
    const nums = s.split(/[\s,]+/).filter(Boolean).map(Number)
    if (nums.some(n => isNaN(n) || n < 0 || n >= max)) return null
    return nums
  }
  function applyList() {
    setErr('')
    const ones = parseList(mintIn)
    if (mintIn.trim() && !ones) { setErr(`Mintérminos válidos: 0–${(1 << vars) - 1}`); return }
    const dcs = parseList(dcIn)
    if (dcIn.trim() && !dcs) { setErr(`Indiferencias válidas: 0–${(1 << vars) - 1}`); return }
    const n = new Array(1 << vars).fill(0)
    ones?.forEach(m => n[m] = 1)
    dcs?.forEach(m => { if (n[m] !== 1) n[m] = 2 })
    setVals(n); setResult(null)
  }
  function compute() {
    const ones = Array.from({ length: 1 << vars }, (_, i) => i).filter(i => vals[i] === 1)
    const groups = findAllGroups(cfg, vals)
    const primes = findPrimes(groups)
    const cover  = minCover(primes, ones)
    setResult({ cover, primes })
  }
  function clear() {
    setVals(new Array(1 << vars).fill(0))
    setResult(null); setMintIn(''); setDcIn(''); setErr('')
  }

  // SOP expression
  const sop = result
    ? result.cover.length === 0 ? 'F = 0'
      : `F = ${result.cover.map(g => groupToTerm(g, cfg)).join(' + ')}`
    : null

  // For each cell, find which cover group it belongs to (first match)
  function coverIdx(m: number): number {
    if (!result) return -1
    return result.cover.findIndex(g => g.includes(m))
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-accent mb-1">Mapa de Karnaugh</h2>
      <p className="text-muted text-sm mb-5">HU-3.2 · HU-3.3 — Simplificación booleana con condiciones de indiferencia (X)</p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <span className="text-xs text-muted uppercase tracking-wide shrink-0">Variables:</span>
        {[2, 3, 4].map(v => (
          <button key={v} onClick={() => changeVars(v)}
            className={`w-9 h-9 rounded-md font-mono font-bold text-sm transition-colors ${vars === v ? 'bg-accent text-bg' : 'bg-bg border border-border text-text hover:border-accent'}`}>
            {v}
          </button>
        ))}
        <span className="text-border mx-1">│</span>
        <button onClick={compute} className="px-4 py-1.5 text-sm font-bold bg-accent text-bg rounded-md hover:opacity-90 transition-opacity">
          Simplificar
        </button>
        <button onClick={clear} className="px-3 py-1.5 text-xs bg-bg border border-border text-muted rounded-md hover:border-accent4 hover:text-accent4 transition-colors">
          Limpiar
        </button>
      </div>

      {/* Minterm input */}
      <div className="flex flex-wrap gap-3 mb-5 items-start">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wide">Mintérminos F=1 (ej: 1,3,5,7)</label>
          <input value={mintIn} onChange={e => setMintIn(e.target.value)} placeholder="0,1,3..."
            className="bg-bg border border-border text-text font-mono px-3 py-1.5 rounded-md text-sm w-48 focus:outline-none focus:border-accent3" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted uppercase tracking-wide">Indiferencias X (ej: 2,4)</label>
          <input value={dcIn} onChange={e => setDcIn(e.target.value)} placeholder="don't care..."
            className="bg-bg border border-border text-text font-mono px-3 py-1.5 rounded-md text-sm w-40 focus:outline-none focus:border-accent2" />
        </div>
        <div className="flex items-end">
          <button onClick={applyList} className="px-3 py-1.5 text-xs font-bold bg-bg border border-accent3/60 text-accent3 rounded-md hover:border-accent3 transition-colors">
            Aplicar
          </button>
        </div>
        <p className="text-xs text-muted pt-6">O hacé clic en las celdas del mapa para alternar <span className="font-mono">0→1→X→0</span></p>
      </div>
      {err && <p className="text-accent4 text-xs mb-3">{err}</p>}

      {/* K-map grid */}
      <div className="overflow-x-auto mb-5">
        <div className="inline-block border border-border rounded-lg overflow-hidden" style={{ background: '#0d1117' }}>
          {/* Column header */}
          <div className="flex">
            <div className="flex items-end justify-end pb-1 pr-2 border-r border-border"
              style={{ width: 72, height: 44, borderBottom: '1px solid var(--border)' }}>
              <span className="text-[10px] text-muted font-mono">{cfg.rowVnames.join('')}╲{cfg.colVnames.join('')}</span>
            </div>
            {cfg.colGray.map((gv, ci) => (
              <div key={ci} className="flex items-center justify-center font-mono text-xs text-accent2 border-r border-b"
                style={{ width: 56, height: 44, borderColor: 'var(--border)' }}>
                {gv.toString(2).padStart(cfg.colVars, '0')}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {cfg.rowGray.map((rowGv, ri) => (
            <div key={ri} className="flex border-b" style={{ borderColor: 'var(--border)' }}>
              {/* Row label */}
              <div className="flex items-center justify-end pr-3 font-mono text-xs text-accent2 border-r shrink-0"
                style={{ width: 72, height: 56, borderColor: 'var(--border)' }}>
                {rowGv.toString(2).padStart(cfg.rowVars, '0')}
              </div>
              {/* Cells */}
              {cfg.colGray.map((_, ci) => {
                const m = cellMinterm(cfg, ri, ci)
                const v = vals[m]
                const gi = coverIdx(m)
                const isHov = hovG !== null && result?.cover[hovG]?.includes(m)
                const bg = isHov
                  ? GB[hovG! % GB.length].replace('20', '40')
                  : gi >= 0 ? GB[gi % GB.length]
                  : 'transparent'
                return (
                  <div key={ci}
                    className="relative flex items-center justify-center border-r cursor-pointer transition-all select-none"
                    style={{ width: 56, height: 56, background: bg, borderColor: 'var(--border)' }}
                    onClick={() => cycleCell(m)}>
                    <span className="absolute top-1 right-1.5 text-[9px] text-muted/60 font-mono">{m}</span>
                    <span className={`font-mono text-xl font-bold transition-colors ${
                      v === 1 ? 'text-accent3' : v === 2 ? 'text-accent2' : 'text-muted'
                    }`}>
                      {v === 0 ? '0' : v === 1 ? '1' : 'X'}
                    </span>
                    {gi >= 0 && (
                      <div className="absolute inset-0 pointer-events-none rounded-sm"
                        style={{ outline: `2px solid ${GC[gi % GC.length]}50`, outlineOffset: '-2px' }} />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Variable labels */}
      <div className="text-xs text-muted mb-5 flex gap-4 flex-wrap">
        <span>Filas → <span className="font-mono text-accent2">{cfg.rowVnames.join('')}</span></span>
        <span>Columnas → <span className="font-mono text-accent2">{cfg.colVnames.join('')}</span></span>
        <span className="text-border">|</span>
        <span>Orden Gray: <span className="font-mono text-accent2">00 01 11 10</span> (celdas adyacentes difieren en 1 bit)</span>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className="bg-bg border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Expresión simplificada — SOP mínima</p>
            <p className="font-mono text-2xl text-accent2 mt-1">{sop}</p>
          </div>

          {result.cover.length > 0 && (
            <div>
              <p className="text-xs text-muted uppercase tracking-wide mb-2">Implicantes primos seleccionados — hover para resaltar</p>
              <div className="flex flex-wrap gap-2">
                {result.cover.map((g, i) => (
                  <div key={i}
                    className="flex items-center gap-2 bg-bg border rounded-lg px-3 py-2 text-sm cursor-default transition-all"
                    style={{ borderColor: GC[i % GC.length] + '60' }}
                    onMouseEnter={() => setHovG(i)} onMouseLeave={() => setHovG(null)}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: GC[i % GC.length] }} />
                    <span className="font-mono font-bold text-accent2">{groupToTerm(g, cfg)}</span>
                    <span className="text-muted text-xs">{g.length === 1 << cfg.vars ? 'todos' : `m(${g.join(',')})`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.primes.length > result.cover.length && (
            <p className="text-xs text-muted">
              {result.primes.length} implicantes primos encontrados,
              {result.cover.length} seleccionados para la cobertura mínima.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
