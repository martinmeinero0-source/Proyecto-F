'use client'

import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export default function ModuleLayout({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-accent mb-2">{title}</h1>
          {description && <p className="text-muted">{description}</p>}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
