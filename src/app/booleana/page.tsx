'use client'

import QuizSection from '@/components/QuizSection'
import GlossarySection from '@/components/GlossarySection'
import SimuladorCompuertas from '@/components/booleana/SimuladorCompuertas'
import SimuladorCircuito from '@/components/booleana/SimuladorCircuito'
import SimuladorKarnaugh from '@/components/booleana/SimuladorKarnaugh'
import { quizByModule } from '@/lib/data/quiz-questions'
import { glossaryByModule } from '@/lib/data/glossary-terms'

export default function BooleanaPage() {
  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-accent mb-4">
          Álgebra Booleana y Simplificación
        </h1>
        <p className="text-muted mb-8">Épica 3: Herramientas para gestión y optimización de funciones lógicas</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-3.1: Formas Canónicas</h2>
            <p className="text-text mb-4">Suma de Productos (Mintérminos) y Producto de Sumas (Maxtérminos)</p>
            <p className="text-sm text-muted">Riesgo: Medio | 5 SP</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-3.2: Diagramas de Karnaugh</h2>
            <p className="text-text mb-4">Mapas interactivos de 1 a 5 variables con agrupaciones</p>
            <p className="text-sm text-muted">⚠️ RIESGO CRÍTICO | 13 SP | Requiere división en 2 sub-historias</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-3.3: Condiciones de Indiferencia</h2>
            <p className="text-text mb-4">Uso de "X" en mapas K para simplificación óptima</p>
            <p className="text-sm text-muted">Riesgo: Medio | Dependencia: HU-3.2</p>
          </div>
        </div>

        <div className="bg-surface2 border border-border rounded-lg p-6 mt-8">
          <p className="text-accent4">⚠️ ATENCIÓN: HU-3.2 es la historia de mayor complejidad del backlog</p>
        </div>

        <SimuladorCompuertas />
        <SimuladorCircuito />
        <SimuladorKarnaugh />

        <QuizSection questions={quizByModule.booleana} />
        <GlossarySection terms={glossaryByModule.booleana} />
      </div>
    </div>
  )
}
