'use client'

import { useState } from 'react'
import type { GlossaryTerm } from '@/types/glossary'

type Props = {
  terms: GlossaryTerm[]
}

export default function GlossarySection({ terms }: Props) {
  const [search, setSearch] = useState('')

  const filtered = terms.filter(
    t =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-accent">Glosario de Términos</h2>
          <p className="text-muted text-sm mt-1">{terms.length} términos clave</p>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar término..."
          className="bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors w-full sm:w-56"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-8 text-center">
          <p className="text-muted">No se encontraron términos para "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div
              key={t.term}
              className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-accent/40 transition-colors"
            >
              <span className="text-accent font-bold font-mono text-sm">{t.term}</span>
              <p className="text-text text-sm leading-relaxed">{t.definition}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
