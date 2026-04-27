'use client'

import QuizSection from '@/components/QuizSection'
import GlossarySection from '@/components/GlossarySection'
import CalculadoraSignados from '@/components/signados/CalculadoraSignados'
import { quizByModule } from '@/lib/data/quiz-questions'
import { glossaryByModule } from '@/lib/data/glossary-terms'

export default function SignadosPage() {
  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-accent mb-4">
          Representación de Números con Signo
        </h1>
        <p className="text-muted mb-8">Épica 2: Almacenamiento de números positivos y negativos en sistemas n-bits</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-2.1: Magnitud y Signo</h2>
            <p className="text-text mb-4">MSB para el signo (0→+, 1→-), problema del "doble cero"</p>
            <p className="text-sm text-muted">Riesgo: Bajo</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-2.2: Complementos (1 y 2)</h2>
            <p className="text-text mb-4">Complemento a 1 y Complemento a 2 con animaciones</p>
            <p className="text-sm text-muted">Riesgo: Medio</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-2.3: Exceso a K</h2>
            <p className="text-text mb-4">Desplazamiento del rango con k = 2^(n-1) - 1 y k = 2^(n-1)</p>
            <p className="text-sm text-muted">Riesgo: Medio | Requiere refinamiento antes de Sprint 2</p>
          </div>
        </div>

        <div className="bg-surface2 border border-border rounded-lg p-6 mt-8">
          <p className="text-accent3">📊 Tabla comparativa de métodos disponible</p>
        </div>

        <CalculadoraSignados />

        <QuizSection questions={quizByModule.signados} />
        <GlossarySection terms={glossaryByModule.signados} />
      </div>
    </div>
  )
}
