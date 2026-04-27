'use client'

import { useState, useRef, useMemo, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR' | 'BUFFER'
interface GateNode   { id: string; kind: 'gate';   type: GateType; x: number; y: number; numInputs: number }
interface InputNode  { id: string; kind: 'input';  x: number; y: number; label: string; value: number }
interface OutputNode { id: string; kind: 'output'; x: number; y: number; label: string }
type CircuitNode = GateNode | InputNode | OutputNode
interface Wire { id: string; fromId: string; toId: string; toPort: number }

// ── Layout ───────────────────────────────────────────────────────────────────

const GW = 72, PSTEP = 22, GMINH = 44, PR = 5, IOW = 56, IOH = 30, VBW = 640, VBH = 460
const gH = (n: number) => Math.max(GMINH, n * PSTEP + PSTEP)

function inPP(node: CircuitNode, port: number): [number, number] {
  if (node.kind === 'gate') {
    const ni = (node as GateNode).numInputs
    return [node.x, node.y + gH(ni) / (ni + 1) * (port + 1)]
  }
  return [node.x, node.y + IOH / 2]
}
function outPP(node: CircuitNode): [number, number] {
  if (node.kind === 'gate')  return [node.x + GW, node.y + gH((node as GateNode).numInputs) / 2]
  if (node.kind === 'input') return [node.x + IOW, node.y + IOH / 2]
  return [node.x, node.y + IOH / 2]
}

// ── Wire routing (orthogonal) ─────────────────────────────────────────────────

function routeWire(a: [number, number], b: [number, number]): string {
  if (Math.abs(a[1] - b[1]) < 2) return `M${a[0]},${a[1]} H${b[0]}`
  const mid = (a[0] + b[0]) / 2
  return `M${a[0]},${a[1]} H${mid} V${b[1]} H${b[0]}`
}

// ── Evaluation ────────────────────────────────────────────────────────────────

function evalGate(type: GateType, ins: number[]): number {
  switch (type) {
    case 'AND':    return ins.every(v => v === 1) ? 1 : 0
    case 'OR':     return ins.some(v => v === 1) ? 1 : 0
    case 'NOT':    return ins[0] ^ 1
    case 'BUFFER': return ins[0]
    case 'XOR':    return ins.reduce((a, b) => a ^ b, 0)
    case 'NAND':   return ins.every(v => v === 1) ? 0 : 1
    case 'NOR':    return ins.some(v => v === 1) ? 0 : 1
    case 'XNOR':   return ins.reduce((a, b) => a ^ b, 0) ^ 1
  }
}

function computeVals(nodes: CircuitNode[], wires: Wire[]): Map<string, number | null> {
  const v = new Map<string, number | null>()
  const wmap = new Map<string, string>()
  for (const w of wires) wmap.set(`${w.toId}:${w.toPort}`, w.fromId)
  for (const n of nodes) if (n.kind === 'input') v.set(n.id, (n as InputNode).value)
  for (let pass = 0; pass < 20; pass++) {
    let changed = false
    for (const n of nodes) {
      if (n.kind === 'input') continue
      const ni = n.kind === 'output' ? 1 : (n as GateNode).numInputs
      const ins: number[] = []; let ok = true
      for (let i = 0; i < ni; i++) {
        const src = wmap.get(`${n.id}:${i}`)
        if (!src) { ok = false; break }
        const val = v.get(src)
        if (val == null) { ok = false; break }
        ins.push(val)
      }
      const next = ok ? (n.kind === 'gate' ? evalGate((n as GateNode).type, ins) : ins[0]) : null
      if (v.get(n.id) !== next) { v.set(n.id, next); changed = true }
    }
    if (!changed) break
  }
  return v
}

// ── Expression derivation ─────────────────────────────────────────────────────

function deriveExpr(id: string, nodes: CircuitNode[], wires: Wire[], vis = new Set<string>()): string {
  if (vis.has(id)) return '∞'
  const node = nodes.find(n => n.id === id)
  if (!node) return '?'
  if (node.kind === 'input') return (node as InputNode).label
  if (node.kind === 'output') {
    const w = wires.find(w => w.toId === id && w.toPort === 0)
    return w ? deriveExpr(w.fromId, nodes, wires, new Set([...vis, id])) : '—'
  }
  const gate = node as GateNode
  const v2 = new Set([...vis, id])
  const getIn = (i: number) => {
    const w = wires.find(w => w.toId === id && w.toPort === i)
    return w ? deriveExpr(w.fromId, nodes, wires, new Set(v2)) : '?'
  }
  const p = (e: string) => /[+⊕]/.test(e) ? `(${e})` : e
  const ins = Array.from({ length: gate.numInputs }, (_, i) => getIn(i))
  switch (gate.type) {
    case 'AND':    return ins.map(p).join('·')
    case 'OR':     return ins.join('+')
    case 'NOT':    return `¬${p(ins[0])}`
    case 'BUFFER': return ins[0]
    case 'XOR':    return ins.join('⊕')
    case 'NAND':   return `¬(${ins.map(p).join('·')})`
    case 'NOR':    return `¬(${ins.join('+')})`
    case 'XNOR':   return `¬(${ins.join('⊕')})`
  }
}

// ── Gate visual shapes ────────────────────────────────────────────────────────

const GATE_FILL: Record<GateType, string> = {
  AND: '#0d1f33', OR: '#0d1f33', NOT: '#1a0d33', NAND: '#1a0d33',
  NOR: '#1a0d33', XOR: '#0d2218', XNOR: '#0d2218', BUFFER: '#1a1a0d',
}
const GATE_STROKE: Record<GateType, string> = {
  AND: '#2a5298', OR: '#2a5298', NOT: '#6a3ab8', NAND: '#6a3ab8',
  NOR: '#6a3ab8', XOR: '#2a8a5a', XNOR: '#2a8a5a', BUFFER: '#8a8a2a',
}

function GateShape({ x, y, h, type, selected }: { x: number; y: number; h: number; type: GateType; selected: boolean }) {
  const pad = 5
  const bx = x + pad, ex = x + GW - pad
  const by = y + pad, ey = y + h - pad
  const cy = y + h / 2
  const bh = ey - by

  const inv = type === 'NOT' || type === 'NAND' || type === 'NOR' || type === 'XNOR'
  const cr = 3.5
  const bodyR = inv ? ex - cr * 2 : ex
  const abw = bodyR - bx

  const stroke = selected ? '#4f8ef7' : GATE_STROKE[type]
  const fill   = GATE_FILL[type]
  const sw = selected ? 2 : 1.5

  // AND / NAND body: flat left + elliptical arc right
  const mx = bx + abw * 0.42
  const andPath = `M${bx},${by} H${mx} A${bodyR - mx},${bh / 2} 0 0 1 ${mx},${ey} H${bx} Z`

  // OR / NOR / XOR / XNOR body: shield shape
  const orPath = `M${bx},${by} Q${bx + abw * 0.68},${by} ${bodyR},${cy} Q${bx + abw * 0.68},${ey} ${bx},${ey} Q${bx + abw * 0.15},${cy} ${bx},${by} Z`

  // NOT / BUFFER body: triangle
  const triR = inv ? bodyR : ex
  const triPath = `M${bx},${by} L${bx},${ey} L${triR},${cy} Z`

  // XOR / XNOR extra curved line (parallel to left side)
  const xorLine = `M${bx - 5},${by + bh * 0.1} Q${bx - 5 + abw * 0.14},${cy} ${bx - 5},${ey - bh * 0.1}`

  const common = { fill, stroke, strokeWidth: sw, strokeLinejoin: 'round' as const }
  const inv_circle = inv ? <circle cx={ex - cr} cy={cy} r={cr} fill={fill} stroke={stroke} strokeWidth={sw - 0.5} /> : null

  let body: React.ReactNode
  switch (type) {
    case 'AND':    body = <path d={andPath} {...common} />; break
    case 'OR':     body = <path d={orPath}  {...common} />; break
    case 'BUFFER': body = <path d={triPath} {...common} />; break
    case 'NOT':    body = <><path d={triPath} {...common} />{inv_circle}</>; break
    case 'NAND':   body = <><path d={andPath} {...common} />{inv_circle}</>; break
    case 'NOR':    body = <><path d={orPath}  {...common} />{inv_circle}</>; break
    case 'XOR':    body = <><path d={orPath} {...common} /><path d={xorLine} fill="none" stroke={stroke} strokeWidth={sw - 0.3} /></>; break
    case 'XNOR':   body = <><path d={orPath} {...common} /><path d={xorLine} fill="none" stroke={stroke} strokeWidth={sw - 0.3} />{inv_circle}</>; break
  }

  return (
    <>
      {body}
      <text x={(bx + bodyR) / 2} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fill={selected ? '#c9d1d9' : '#7a8499'} fontSize={9} fontWeight="bold" fontFamily="monospace"
        style={{ pointerEvents: 'none' }}>{type}</text>
    </>
  )
}

// ── Gate info data ────────────────────────────────────────────────────────────

const GATE_DESCS: Record<GateType, string> = {
  AND:    'Salida 1 solo si TODAS las entradas son 1',
  OR:     'Salida 1 si AL MENOS UNA entrada es 1',
  NOT:    'Invierte la entrada: 0→1, 1→0',
  BUFFER: 'Propaga la señal sin modificar (buffer de corriente)',
  XOR:    'Salida 1 si número IMPAR de entradas son 1',
  NAND:   'NOT AND — compuerta universal, puede implementar cualquier función',
  NOR:    'NOT OR — compuerta universal, puede implementar cualquier función',
  XNOR:   'Detector de igualdad: salida 1 cuando las entradas son iguales',
}
const GATE_EXPRS: Record<GateType, string> = {
  AND: 'A·B', OR: 'A+B', NOT: 'Ā', BUFFER: 'A', XOR: 'A⊕B',
  NAND: '¬(A·B)', NOR: '¬(A+B)', XNOR: '¬(A⊕B)',
}

function buildRows(type: GateType) {
  const n = type === 'NOT' || type === 'BUFFER' ? 1 : 2
  return Array.from({ length: 1 << n }, (_, i) => {
    const ins = Array.from({ length: n }, (_, b) => (i >> (n - 1 - b)) & 1)
    return { ins, out: evalGate(type, ins) }
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

let cnt = 100
const uid = () => String(++cnt)
const C1 = '#5ef7a4', C0 = '#4f8ef7', CX = '#3d4451'
const vc = (v: number | null | undefined) => v === 1 ? C1 : v === 0 ? C0 : CX
const PALETTE: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER']

// ── Component ─────────────────────────────────────────────────────────────────

export default function SimuladorCircuito() {
  const patId = useRef(`csg${Math.random().toString(36).slice(2, 7)}`)

  const [nodes, setNodes] = useState<CircuitNode[]>([
    { id: 'i0', kind: 'input',  x: 30,  y: 90,  label: 'A', value: 0 },
    { id: 'i1', kind: 'input',  x: 30,  y: 155, label: 'B', value: 0 },
    { id: 'o0', kind: 'output', x: 450, y: 120, label: 'F' },
  ])
  const [wires,   setWires]   = useState<Wire[]>([])
  const [pending, setPending] = useState<{ fromId: string; pos: [number, number] } | null>(null)
  const [cursor,  setCursor]  = useState<[number, number]>([0, 0])
  const [drag,    setDrag]    = useState<{ id: string; ox: number; oy: number } | null>(null)
  const [sel,     setSel]     = useState<string | null>(null)
  const [hov,     setHov]     = useState<string | null>(null)
  const [hovGate, setHovGate] = useState<GateType | null>(null)
  const [showRef, setShowRef] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  const vals = useMemo(() => computeVals(nodes, wires), [nodes, wires])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setSel(prev => {
          if (prev) {
            setNodes(p => p.filter(n => n.id !== prev))
            setWires(p => p.filter(w => w.fromId !== prev && w.toId !== prev))
          }
          return null
        })
      }
      if (e.key === 'Escape') { setPending(null); setSel(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function svgPt(e: React.MouseEvent): [number, number] {
    const r = svgRef.current!.getBoundingClientRect()
    return [(e.clientX - r.left) * (VBW / r.width), (e.clientY - r.top) * (VBH / r.height)]
  }

  function addGate(type: GateType) {
    const ni = type === 'NOT' || type === 'BUFFER' ? 1 : 2
    setNodes(p => {
      const idx = p.filter(n => n.kind === 'gate').length
      return [...p, { id: uid(), kind: 'gate', type, numInputs: ni, x: 190 + (idx % 4) * 20, y: 60 + (idx % 6) * 60 }]
    })
  }
  function addInput() {
    setNodes(p => {
      const ic = p.filter(n => n.kind === 'input').length
      return [...p, { id: uid(), kind: 'input', x: 30, y: 30 + ic * 65, label: String.fromCharCode(65 + ic), value: 0 }]
    })
  }
  function addOutput() {
    setNodes(p => {
      const oc = p.filter(n => n.kind === 'output').length
      return [...p, { id: uid(), kind: 'output', x: 450, y: 30 + oc * 65, label: oc === 0 ? 'F' : `F${oc}` }]
    })
  }
  function delNode(id: string) {
    setNodes(p => p.filter(n => n.id !== id))
    setWires(p => p.filter(w => w.fromId !== id && w.toId !== id))
    if (sel === id) setSel(null)
  }
  function changeGateInputs(id: string, delta: number) {
    const node = nodes.find(n => n.id === id)
    if (!node || node.kind !== 'gate') return
    const gate = node as GateNode
    if (gate.type === 'NOT' || gate.type === 'BUFFER') return
    const next = Math.min(4, Math.max(2, gate.numInputs + delta))
    if (next === gate.numInputs) return
    setNodes(p => p.map(n => n.id === id ? { ...gate, numInputs: next } : n))
    if (next < gate.numInputs) setWires(p => p.filter(w => !(w.toId === id && w.toPort >= next)))
  }
  function clearAll() {
    setNodes([
      { id: uid(), kind: 'input',  x: 30,  y: 90,  label: 'A', value: 0 },
      { id: uid(), kind: 'input',  x: 30,  y: 155, label: 'B', value: 0 },
      { id: uid(), kind: 'output', x: 450, y: 120, label: 'F' },
    ])
    setWires([]); setPending(null); setSel(null)
  }

  function startWire(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setPending({ fromId: id, pos: outPP(nodes.find(n => n.id === id)!) })
  }
  function onInPort(e: React.MouseEvent, id: string, port: number) {
    e.stopPropagation()
    if (pending) {
      if (pending.fromId === id) { setPending(null); return }
      setWires(p => [...p.filter(w => !(w.toId === id && w.toPort === port)), { id: uid(), fromId: pending.fromId, toId: id, toPort: port }])
      setPending(null)
    } else {
      setWires(p => p.filter(w => !(w.toId === id && w.toPort === port)))
    }
  }
  function onNodeMD(e: React.MouseEvent, id: string) {
    if (pending) return
    e.stopPropagation()
    const n = nodes.find(n => n.id === id)!
    const pt = svgPt(e)
    setDrag({ id, ox: n.x - pt[0], oy: n.y - pt[1] }); setSel(id)
  }
  function onMM(e: React.MouseEvent) {
    const pt = svgPt(e)
    setCursor(pt)
    if (drag) setNodes(p => p.map(n => n.id === drag.id ? { ...n, x: Math.max(2, pt[0] + drag.ox), y: Math.max(2, pt[1] + drag.oy) } : n))
  }

  const exprs = useMemo(() =>
    nodes.filter(n => n.kind === 'output').map(n => ({
      label: (n as OutputNode).label,
      expr: deriveExpr(n.id, nodes, wires),
      val: vals.get(n.id) ?? null,
    })), [nodes, wires, vals])

  const selNode = sel ? nodes.find(n => n.id === sel) ?? null : null
  const pendingLabel = (() => {
    if (!pending) return ''
    const fn = nodes.find(n => n.id === pending.fromId)
    return !fn ? '' : fn.kind === 'input' ? (fn as InputNode).label : fn.kind === 'gate' ? (fn as GateNode).type : 'nodo'
  })()

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-accent mb-1">Simulador de Circuitos Lógicos</h2>
      <p className="text-muted text-sm mb-4">Conectá compuertas con cables, observá la propagación en tiempo real</p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="text-xs text-muted uppercase tracking-wide shrink-0">Gates:</span>
        {PALETTE.map(g => (
          <button key={g} onClick={() => addGate(g)}
            onMouseEnter={() => setHovGate(g)} onMouseLeave={() => setHovGate(null)}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-bg border border-border text-text rounded hover:border-accent hover:text-accent transition-colors">
            {g}
          </button>
        ))}
        <span className="text-border mx-1">│</span>
        <button onClick={addInput}  className="px-2.5 py-1 text-xs font-mono bg-bg border border-accent3/60 text-accent3 rounded hover:border-accent3 transition-colors">+ Entrada</button>
        <button onClick={addOutput} className="px-2.5 py-1 text-xs font-mono bg-bg border border-accent2/60 text-accent2 rounded hover:border-accent2 transition-colors">+ Salida</button>

        {sel && selNode?.kind === 'gate' && (selNode as GateNode).type !== 'NOT' && (selNode as GateNode).type !== 'BUFFER' && (
          <>
            <span className="text-border mx-1">│</span>
            <button onClick={() => changeGateInputs(sel, -1)} className="px-2 py-1 text-xs font-mono bg-bg border border-border text-muted rounded hover:border-accent hover:text-accent">−E</button>
            <span className="text-xs font-mono text-muted">{(selNode as GateNode).numInputs}e</span>
            <button onClick={() => changeGateInputs(sel, +1)} className="px-2 py-1 text-xs font-mono bg-bg border border-border text-muted rounded hover:border-accent hover:text-accent">+E</button>
          </>
        )}
        {sel && (
          <button onClick={() => delNode(sel)} className="px-2.5 py-1 text-xs font-bold bg-accent4/10 border border-accent4/40 text-accent4 rounded hover:bg-accent4/20 transition-colors">
            ✕ Eliminar
          </button>
        )}
        <span className="text-border mx-1">│</span>
        <button onClick={() => setShowRef(p => !p)}
          className="px-2.5 py-1 text-xs font-bold bg-bg border border-border text-muted rounded hover:border-accent2 hover:text-accent2 transition-colors">
          {showRef ? '▲ Ocultar referencia' : '▼ Ver todas las compuertas'}
        </button>
        <button onClick={clearAll} className="px-2.5 py-1 text-xs bg-bg border border-border text-muted rounded hover:border-accent4 hover:text-accent4 ml-auto">↺ Limpiar</button>
      </div>

      {/* Gate info tooltip on palette hover */}
      {hovGate && (
        <div className="mb-3 bg-bg border border-accent/30 rounded px-3 py-2 text-xs flex gap-4 items-start">
          <div className="shrink-0">
            <svg width="72" height="44" viewBox="0 0 72 44" style={{ display: 'block' }}>
              <GateShape x={0} y={0} h={44} type={hovGate} selected={false} />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-mono font-bold text-accent2 mb-0.5">{hovGate} — F = {GATE_EXPRS[hovGate]}</p>
            <p className="text-text mb-2">{GATE_DESCS[hovGate]}</p>
            <div className="flex gap-1 flex-wrap">
              {buildRows(hovGate).map((r, i) => (
                <span key={i} className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${r.out === 1 ? 'bg-accent3/15 text-accent3' : 'bg-accent4/10 text-accent4'}`}>
                  {r.ins.join(',')}→{r.out}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reference panel */}
      {showRef && !hovGate && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PALETTE.map(g => {
            const rows = buildRows(g)
            const n = g === 'NOT' || g === 'BUFFER' ? 1 : 2
            return (
              <div key={g} className="bg-bg border border-border rounded-lg p-2.5 text-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg width="54" height="33" viewBox="0 0 72 44" style={{ display: 'block', flexShrink: 0 }}>
                    <GateShape x={0} y={0} h={44} type={g} selected={false} />
                  </svg>
                  <div>
                    <p className="font-mono font-bold text-accent2 leading-none">{g}</p>
                    <p className="font-mono text-accent3 text-[10px] mt-0.5">F={GATE_EXPRS[g]}</p>
                  </div>
                </div>
                <p className="text-muted leading-snug mb-2" style={{ fontSize: '10px' }}>{GATE_DESCS[g]}</p>
                <table className="w-full" style={{ fontSize: '10px' }}>
                  <thead>
                    <tr className="border-b border-border">
                      {Array.from({ length: n }, (_, i) => (
                        <th key={i} className="text-muted font-normal text-center pb-0.5">{String.fromCharCode(65 + i)}</th>
                      ))}
                      <th className="text-accent3 font-bold text-center pb-0.5">F</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        {r.ins.map((v, j) => <td key={j} className="font-mono text-center text-text">{v}</td>)}
                        <td className={`font-mono text-center font-bold ${r.out === 1 ? 'text-accent3' : 'text-accent4'}`}>{r.out}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      )}

      {/* Status bar */}
      <div className="mb-2 text-xs">
        {pending ? (
          <p className="text-accent bg-accent/10 border border-accent/20 rounded px-3 py-1.5">
            Conectando desde <strong className="font-mono">{pendingLabel}</strong> →
            clic en puerto <span className="text-accent2 font-bold">amarillo</span> para conectar ·
            <kbd className="bg-bg/60 border border-border px-1 rounded mx-1">Esc</kbd> para cancelar
          </p>
        ) : (
          <p className="text-muted">
            <span className="text-accent font-semibold">Puerto azul</span> = salida (clic → cable) ·
            <span className="text-accent2 font-semibold"> Puerto amarillo</span> = entrada (clic → conectar/desconectar) ·
            Clic en cable elimina ·
            <kbd className="bg-bg border border-border px-1 rounded mx-1">Del</kbd> elimina nodo seleccionado
          </p>
        )}
      </div>

      {/* Canvas */}
      <div className="rounded-lg overflow-hidden border border-border select-none" style={{ background: '#0d1117' }}>
        <svg ref={svgRef} width="100%" height="460" viewBox={`0 0 ${VBW} ${VBH}`}
          onMouseMove={onMM} onMouseUp={() => setDrag(null)}
          onClick={() => { if (pending) setPending(null); else setSel(null) }}
          style={{ display: 'block', cursor: pending ? 'crosshair' : 'default' }}>
          <defs>
            <pattern id={patId.current} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.8" fill="#21262d" />
            </pattern>
          </defs>
          <rect width={VBW} height={VBH} fill={`url(#${patId.current})`} />

          {/* Wires */}
          {wires.map(w => {
            const fn = nodes.find(n => n.id === w.fromId), tn = nodes.find(n => n.id === w.toId)
            if (!fn || !tn) return null
            const fp = outPP(fn), tp = inPP(tn, w.toPort)
            const isHovW = hov === `w:${w.id}`
            const col = isHovW ? '#f7635e' : vc(vals.get(w.fromId))
            return (
              <g key={w.id} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHov(`w:${w.id}`)} onMouseLeave={() => setHov(null)}
                onClick={e => { e.stopPropagation(); setWires(p => p.filter(x => x.id !== w.id)) }}>
                <path d={routeWire(fp, tp)} stroke="transparent" strokeWidth={12} fill="none" />
                <path d={routeWire(fp, tp)} stroke={col} strokeWidth={isHovW ? 3 : 2} fill="none" strokeLinecap="square" />
              </g>
            )
          })}

          {/* Pending wire preview */}
          {pending && <path d={routeWire(pending.pos, cursor)} stroke="#4f8ef7" strokeWidth={1.5} strokeDasharray="6,3" fill="none" opacity={0.7} />}

          {/* Nodes */}
          {nodes.map(node => {
            const isSel = sel === node.id
            const nval  = vals.get(node.id)

            // Input
            if (node.kind === 'input') {
              const n = node as InputNode
              const [ox, oy] = outPP(n)
              const on = n.value === 1
              const isHO = hov === `${n.id}:out`
              return (
                <g key={n.id} onMouseDown={e => onNodeMD(e, n.id)} style={{ cursor: drag?.id === n.id ? 'grabbing' : 'grab' }}>
                  <rect x={n.x} y={n.y} width={IOW} height={IOH} rx={8}
                    fill={on ? '#0d3322' : '#0d1f33'} stroke={isSel ? '#4f8ef7' : on ? '#5ef7a4' : '#21262d'} strokeWidth={isSel ? 2 : 1.5}
                    style={{ cursor: 'pointer' }}
                    onClick={e => { e.stopPropagation(); setNodes(p => p.map(x => x.id === n.id && x.kind === 'input' ? { ...x, value: x.value ^ 1 } : x)) }} />
                  <text x={n.x + IOW / 2} y={n.y + IOH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                    fill={on ? '#5ef7a4' : '#8b949e'} fontSize={12} fontWeight="bold" fontFamily="monospace"
                    style={{ pointerEvents: 'none' }}>{n.label}={n.value}</text>
                  <circle cx={ox} cy={oy} r={PR + (isHO ? 4 : 2)} fill="#0d1117"
                    stroke={isHO ? '#80ffbb' : pending?.fromId === n.id ? '#60a5fa' : '#4f8ef7'} strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHov(`${n.id}:out`)} onMouseLeave={() => setHov(null)}
                    onClick={e => startWire(e, n.id)} />
                  <circle cx={ox} cy={oy} r={PR - 1} fill={vc(n.value)} style={{ pointerEvents: 'none' }} />
                </g>
              )
            }

            // Output
            if (node.kind === 'output') {
              const n = node as OutputNode
              const [ix, iy] = inPP(n, 0)
              const iw = wires.find(w => w.toId === n.id && w.toPort === 0)
              const ipv = iw ? (vals.get(iw.fromId) ?? null) : null
              const isHI = hov === `${n.id}:0`
              return (
                <g key={n.id} onMouseDown={e => onNodeMD(e, n.id)} style={{ cursor: drag?.id === n.id ? 'grabbing' : 'grab' }}>
                  {nval === 1 && <rect x={n.x - 3} y={n.y - 3} width={IOW + 6} height={IOH + 6} rx={11} fill="#5ef7a415" />}
                  <rect x={n.x} y={n.y} width={IOW} height={IOH} rx={8}
                    fill={nval === 1 ? '#0d3322' : '#0d1117'} stroke={isSel ? '#4f8ef7' : nval === 1 ? '#5ef7a4' : '#21262d'} strokeWidth={isSel ? 2 : 1.5} />
                  <circle cx={n.x + 13} cy={n.y + IOH / 2} r={7} fill={nval === 1 ? '#5ef7a4' : nval === 0 ? '#112211' : '#21262d'} />
                  {nval === 1 && <circle cx={n.x + 13} cy={n.y + IOH / 2} r={11} fill="#5ef7a418" />}
                  <text x={n.x + 26} y={n.y + IOH / 2 + 1} dominantBaseline="middle"
                    fill={nval === 1 ? '#8fe88f' : '#6b7394'} fontSize={11} fontFamily="monospace"
                    style={{ pointerEvents: 'none' }}>{n.label}</text>
                  <circle cx={ix} cy={iy} r={PR + (isHI ? 4 : 2)} fill="#0d1117"
                    stroke={isHI ? (!!iw && !pending ? '#f7635e' : '#ffd700') : '#f7c948'} strokeWidth={1.5}
                    style={{ cursor: pending || !!iw ? 'pointer' : 'default' }}
                    onMouseEnter={() => setHov(`${n.id}:0`)} onMouseLeave={() => setHov(null)}
                    onClick={e => onInPort(e, n.id, 0)} />
                  <circle cx={ix} cy={iy} r={PR - 1} fill={vc(ipv)} style={{ pointerEvents: 'none' }} />
                </g>
              )
            }

            // Gate
            const gate = node as GateNode
            const h = gH(gate.numInputs)
            const [ox, oy] = outPP(gate)
            const isHO = hov === `${gate.id}:out`

            return (
              <g key={gate.id} onMouseDown={e => onNodeMD(e, gate.id)} style={{ cursor: drag?.id === gate.id ? 'grabbing' : 'grab' }}>
                {/* Input stub lines */}
                {Array.from({ length: gate.numInputs }, (_, i) => {
                  const [px, py] = inPP(gate, i)
                  return <line key={`stb${i}`} x1={px} y1={py} x2={gate.x + 5} y2={py}
                    stroke={GATE_STROKE[gate.type]} strokeWidth={1} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                })}
                {/* Output stub line */}
                <line x1={gate.x + GW - 5} y1={oy} x2={ox} y2={oy}
                  stroke={GATE_STROKE[gate.type]} strokeWidth={1} strokeLinecap="round" style={{ pointerEvents: 'none' }} />

                {/* Gate body symbol */}
                <GateShape x={gate.x} y={gate.y} h={h} type={gate.type} selected={isSel} />

                {/* Input ports */}
                {Array.from({ length: gate.numInputs }, (_, i) => {
                  const [px, py] = inPP(gate, i)
                  const iw = wires.find(w => w.toId === gate.id && w.toPort === i)
                  const ipv = iw ? (vals.get(iw.fromId) ?? null) : null
                  const isHI = hov === `${gate.id}:${i}`
                  return (
                    <g key={i} style={{ cursor: pending || !!iw ? 'pointer' : 'default' }}
                      onMouseEnter={() => setHov(`${gate.id}:${i}`)} onMouseLeave={() => setHov(null)}
                      onClick={e => onInPort(e, gate.id, i)}>
                      <circle cx={px} cy={py} r={PR + (isHI ? 4 : 2)} fill="#0d1117"
                        stroke={isHI ? (!!iw && !pending ? '#f7635e' : '#ffd700') : '#f7c948'} strokeWidth={1.5} />
                      <circle cx={px} cy={py} r={PR - 1} fill={vc(ipv)} style={{ pointerEvents: 'none' }} />
                    </g>
                  )
                })}

                {/* Output port */}
                <g style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHov(`${gate.id}:out`)} onMouseLeave={() => setHov(null)}
                  onClick={e => startWire(e, gate.id)}>
                  <circle cx={ox} cy={oy} r={PR + (isHO ? 4 : 2)}
                    fill={pending?.fromId === gate.id ? '#1e3a5f' : '#0d1117'}
                    stroke={isHO ? '#80ffbb' : '#4f8ef7'} strokeWidth={1.5} />
                  <circle cx={ox} cy={oy} r={PR - 1} fill={vc(nval)} style={{ pointerEvents: 'none' }} />
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Expression panel */}
      {exprs.some(e => e.expr !== '—') && (
        <div className="mt-3 bg-bg border border-border rounded-lg px-4 py-3">
          <p className="text-xs text-muted uppercase tracking-wide mb-2">Expresión booleana derivada</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {exprs.map(e => (
              <div key={e.label} className="flex items-baseline gap-2">
                <span className={`font-mono text-sm font-bold ${e.val === 1 ? 'text-accent3' : e.val === 0 ? 'text-accent' : 'text-muted'}`}>{e.label}</span>
                <span className="text-muted">=</span>
                <span className="font-mono text-sm text-accent2">{e.expr}</span>
                {e.val !== null && <span className={`font-mono text-xs font-bold ${e.val === 1 ? 'text-accent3' : 'text-accent4'}`}>[{e.val}]</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span><span style={{ color: C1 }}>●</span> 1 (ALTO)</span>
        <span><span style={{ color: C0 }}>●</span> 0 (BAJO)</span>
        <span><span style={{ color: CX }}>●</span> Sin señal</span>
        <span className="text-border">|</span>
        <span>Clic en entrada → alterna 0/1</span>
        <span>Hover cable → rojo → clic elimina</span>
        <span>Hover puerto amarillo con cable → rojo → clic desconecta</span>
        <span><kbd className="bg-bg border border-border px-1 rounded">Del</kbd> elimina seleccionado</span>
      </div>
    </div>
  )
}
