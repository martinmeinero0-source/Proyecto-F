'use client'

import QuizSection from '@/components/QuizSection'
import GlossarySection from '@/components/GlossarySection'
import CalculadoraErrores from '@/components/errores/CalculadoraErrores'
import { quizByModule } from '@/lib/data/quiz-questions'
import { glossaryByModule } from '@/lib/data/glossary-terms'

export default function ErroresPage() {
  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-accent mb-4">
          Códigos, Detección y Corrección de Errores
        </h1>
        <p className="text-muted mb-8">Épica 4: Protocolos de codificación y verificación de integridad</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-4.1: Códigos Numéricos</h2>
            <p className="text-text mb-4">BCD, Código Gray, ASCII, Unicode UTF-16 (16 bits/carácter)</p>
            <p className="text-sm text-muted">Riesgo: Bajo | 5 SP</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-4.2: Verificación de Paridad</h2>
            <p className="text-text mb-4">Análisis de tramas para detección de errores (Paridad PAR)</p>
            <p className="text-sm text-muted">Riesgo: Bajo | 3 SP</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-4.3: Hamming y CRC</h2>
            <p className="text-text mb-4">Codificación Hamming (paridad PAR) y CRC con polinomio generador configurable</p>
            <p className="text-sm text-muted">Riesgo: Medio | 8 SP | Posible división en 2 entregas</p>
          </div>
        </div>

        <div className="bg-surface2 border border-border rounded-lg p-6 mt-8">
          <p className="text-accent3">✓ HU-4.1 y HU-4.2 listos para Sprint 3 | HU-4.3 requiere confirmación con PO</p>
        </div>

        <CalculadoraErrores />

        <QuizSection questions={quizByModule.errores} />
        <GlossarySection terms={glossaryByModule.errores} />
      </div>
    </div>
  )
}
