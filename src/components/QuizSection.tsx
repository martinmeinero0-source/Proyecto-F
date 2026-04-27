'use client'

import { useState } from 'react'
import type { QuizQuestion } from '@/types/quiz'

type Props = {
  questions: QuizQuestion[]
}

export default function QuizSection({ questions }: Props) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [showPending, setShowPending] = useState(false)

  const toggle = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const markKnown = (id: string) => {
    setKnown(prev => new Set(prev).add(id))
    setRevealed(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const markReview = (id: string) => {
    setKnown(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const reset = () => {
    setRevealed(new Set())
    setKnown(new Set())
    setShowPending(false)
  }

  const displayed = showPending
    ? questions.filter(q => !known.has(q.id))
    : questions

  const progress = Math.round((known.size / questions.length) * 100)

  return (
    <section className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-accent">Práctica de Repaso</h2>
          <p className="text-muted text-sm mt-1">
            {known.size} de {questions.length} preguntas dominadas
          </p>
        </div>

        <div className="flex items-center gap-3">
          {known.size > 0 && (
            <button
              onClick={reset}
              className="text-sm text-muted hover:text-text transition-colors"
            >
              Reiniciar
            </button>
          )}
          <button
            onClick={() => setShowPending(p => !p)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              showPending
                ? 'border-accent2 text-accent2 bg-accent2/10'
                : 'border-border text-muted hover:border-muted'
            }`}
          >
            {showPending ? `Pendientes (${questions.length - known.size})` : 'Ver todas'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-surface2 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {displayed.length === 0 ? (
        <div className="bg-surface border border-accent3/30 rounded-lg p-8 text-center">
          <p className="text-accent3 font-semibold text-lg">Dominaste todas las preguntas</p>
          <button
            onClick={reset}
            className="mt-4 text-sm text-muted hover:text-text transition-colors underline underline-offset-2"
          >
            Volver a practicar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map(q => {
            const isRevealed = revealed.has(q.id)
            const isKnown = known.has(q.id)

            return (
              <div
                key={q.id}
                className={`bg-surface border rounded-lg p-5 flex flex-col gap-3 transition-colors ${
                  isKnown ? 'border-accent3/40' : 'border-border'
                }`}
              >
                <p className="text-text font-medium leading-snug">{q.question}</p>

                {isRevealed ? (
                  <>
                    <div className="bg-surface2 border border-border rounded p-3">
                      <p className="text-accent2 text-sm leading-relaxed">{q.answer}</p>
                    </div>
                    <div className="flex gap-2 mt-auto pt-1">
                      <button
                        onClick={() => markKnown(q.id)}
                        className="flex-1 py-1.5 text-sm font-semibold rounded bg-accent3/15 text-accent3 border border-accent3/30 hover:bg-accent3/25 transition-colors"
                      >
                        Lo sé
                      </button>
                      <button
                        onClick={() => { markReview(q.id); toggle(q.id) }}
                        className="flex-1 py-1.5 text-sm font-semibold rounded bg-accent4/15 text-accent4 border border-accent4/30 hover:bg-accent4/25 transition-colors"
                      >
                        Repasar
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => toggle(q.id)}
                    className="mt-auto py-1.5 text-sm font-semibold rounded border border-accent/40 text-accent hover:bg-accent/10 transition-colors"
                  >
                    Ver respuesta
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
