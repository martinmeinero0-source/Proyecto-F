'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  const epics = [
    {
      id: 1,
      name: "Sistema de Conversión Numérica Multibase",
      path: "/conversiones",
      color: "from-blue-500 to-blue-600",
      icon: "🔢",
    },
    {
      id: 2,
      name: "Representación de Números con Signo",
      path: "/signados",
      color: "from-purple-500 to-purple-600",
      icon: "±",
    },
    {
      id: 3,
      name: "Álgebra Booleana y Simplificación",
      path: "/booleana",
      color: "from-yellow-500 to-yellow-600",
      icon: "∧∨",
    },
    {
      id: 4,
      name: "Códigos, Detección y Corrección de Errores",
      path: "/errores",
      color: "from-green-500 to-green-600",
      icon: "✓",
    },
    {
      id: 5,
      name: "Simulador de Escenarios",
      path: "/simulador",
      color: "from-red-500 to-red-600",
      icon: "🎯",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-accent">Proyecto F</span>
          </h1>
          <p className="text-xl text-muted mb-2">
            Plataforma de Práctica para Matemática Discreta y Diseño Lógico
          </p>
          <p className="text-muted">
            Tecnicatura Universitaria en Desarrollo de Software
          </p>
        </motion.div>

        {/* Epic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {epics.map((epic, idx) => (
            <motion.div
              key={epic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={epic.path}>
                <div className={`bg-gradient-to-br ${epic.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full`}>
                  <div className="text-4xl mb-3">{epic.icon}</div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {epic.name}
                  </h2>
                  <p className="text-white/80 text-sm">
                    Épica {epic.id}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        <motion.div
          className="bg-surface border border-border rounded-lg p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-muted mb-4">
            🚀 Plataforma en desarrollo - Sprint 1 iniciado
          </p>
          <p className="text-text">
            Selecciona una épica para comenzar a explorar los módulos educativos
          </p>
        </motion.div>
      </div>
    </main>
  )
}
