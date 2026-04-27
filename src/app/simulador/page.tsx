'use client'

import SimuladorEscenario from '@/components/simulador/SimuladorEscenario'

export default function SimuladorPage() {
  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-accent mb-4">
          Simulador de Escenarios
        </h1>
        <p className="text-muted mb-8">Épica 5: Integración de conceptos en un entorno práctico</p>

        <SimuladorEscenario />
      </div>
    </div>
  )
}
