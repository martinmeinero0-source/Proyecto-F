'use client'

import QuizSection from '@/components/QuizSection'
import GlossarySection from '@/components/GlossarySection'
import ConversorInteractivo from '@/components/conversiones/ConversorInteractivo'
import RestasInteractivo from '@/components/conversiones/RestasInteractivo'
import { quizByModule } from '@/lib/data/quiz-questions'
import { glossaryByModule } from '@/lib/data/glossary-terms'

export default function ConversionesPage() {
  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-accent mb-4">
          Sistema de Conversión Numérica Multibase
        </h1>
        <p className="text-muted mb-8">Épica 1: Conversión entre bases decimal, binaria, octal y hexadecimal</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-1.1: Decimal → Otras Bases</h2>
            <p className="text-text mb-4">Conversión de números enteros decimales a otras bases (binaria, octal, hexadecimal)</p>
            <p className="text-sm text-muted">Método: Divisiones Sucesivas</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-1.2: Decimal Fraccionario</h2>
            <p className="text-text mb-4">Conversión de partes fraccionarias con límite de precisión</p>
            <p className="text-sm text-muted">Método: Multiplicaciones Sucesivas</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-1.3: Bases → Decimal</h2>
            <p className="text-text mb-4">Conversión desde cualquier base al sistema decimal</p>
            <p className="text-sm text-muted">Método: Potencias (Polinomial)</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-1.4: Conversiones Directas</h2>
            <p className="text-text mb-4">Binario ↔ Octal (3 bits) y Binario ↔ Hexadecimal (4 bits)</p>
            <p className="text-sm text-muted">Método: Agrupación de bits</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-accent2 mb-4">HU-1.5: Método de Restas Sucesivas</h2>
            <p className="text-text mb-4">Interfaz interactiva con tabla de potencias de 2</p>
            <p className="text-sm text-muted">Método: Tabla interactiva drag-and-click</p>
          </div>
        </div>

        <div className="bg-surface2 border border-border rounded-lg p-6 mt-8">
          <p className="text-accent3">✨ En desarrollo - Sprint 1</p>
        </div>

        <ConversorInteractivo />
        <RestasInteractivo />

        <QuizSection questions={quizByModule.conversiones} />
        <GlossarySection terms={glossaryByModule.conversiones} />
      </div>
    </div>
  )
}
