'use client'

import React from 'react'

interface StepDisplayProps {
  steps: Array<{
    step: number
    operation: string
    result: string
    remainder?: number | string
  }>
  title?: string
}

export default function StepDisplay({ steps, title = 'Pasos del Algoritmo' }: StepDisplayProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-accent mb-4">{title}</h2>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.step}
            className="bg-surface2 border border-border rounded p-4 flex items-center gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-accent text-bg rounded-full flex items-center justify-center font-bold">
              {step.step}
            </div>
            
            <div className="flex-1">
              <p className="text-text font-mono text-sm">{step.operation}</p>
              <p className="text-muted text-xs mt-1">
                Resultado: <span className="text-accent3">{step.result}</span>
                {step.remainder !== undefined && (
                  <span className="ml-2">
                    Resto: <span className="text-accent2">{step.remainder}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
