# Proyecto F - Plataforma Educativa de Matemática Discreta y Diseño Lógico

## 📋 Descripción

**Proyecto F** es una plataforma web educativa interactiva diseñada para estudiantes de la **Tecnicatura Universitaria en Desarrollo de Software**. Permite practicar conceptos fundamentales de sistemas numéricos, álgebra booleana y diseño lógico mediante herramientas interactivas y simuladores.

## 🏗️ Estructura del Proyecto

```
proyecto-f/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css
│   │   ├── conversiones/      # Épica 1
│   │   ├── signados/          # Épica 2
│   │   ├── booleana/          # Épica 3
│   │   ├── errores/           # Épica 4
│   │   └── simulador/         # Épica 5
│   │
│   ├── modules/               # Módulos por épica
│   │   ├── conversiones-numericas/
│   │   ├── numeros-signados/
│   │   ├── algebra-booleana/
│   │   ├── codigos-errores/
│   │   └── simulador-escenarios/
│   │
│   ├── components/            # Componentes reutilizables
│   ├── lib/                   # Lógica de negocio
│   │   ├── algorithms/        # Implementación de algoritmos
│   │   └── utils/             # Utilidades compartidas
│   ├── styles/                # Estilos globales
│   └── types/                 # Tipos TypeScript
│
├── tests/
│   ├── unit/                  # Tests unitarios (Jest)
│   └── e2e/                   # Tests E2E (Playwright)
│
├── public/                    # Archivos estáticos
├── package.json               # Dependencias
├── tsconfig.json              # Configuración TypeScript
├── next.config.js             # Configuración Next.js
├── tailwind.config.ts         # Configuración Tailwind CSS
├── playwright.config.ts       # Configuración Playwright
├── jest.config.js             # Configuración Jest
└── README.md
```

## 🎯 Épicas del Proyecto

### Épica 1: Sistema de Conversión Numérica Multibase (26 SP)
Conversión entre bases decimal, binaria, octal y hexadecimal.
- **HU-1.1**: Decimal → Otras bases (enteros) - 5 SP
- **HU-1.2**: Decimal fraccionario - 8 SP
- **HU-1.3**: Otras bases → Decimal - 3 SP
- **HU-1.4**: Conversiones directas (potencias de 2) - 3 SP
- **HU-1.5**: Método de restas sucesivas - 7 SP

### Épica 2: Representación de Números con Signo (18 SP)
Almacenamiento de números positivos y negativos en sistemas n-bits.
- **HU-2.1**: Magnitud y signo - 5 SP
- **HU-2.2**: Complementos (1 y 2) - 8 SP
- **HU-2.3**: Exceso a K - 5 SP

### Épica 3: Álgebra Booleana y Simplificación (21 SP)
Gestión de funciones lógicas y su optimización.
- **HU-3.1**: Formas canónicas (SOP/POS) - 5 SP
- **HU-3.2**: Diagramas de Karnaugh (1-5 variables) - 13 SP ⚠️ CRÍTICO
- **HU-3.3**: Condiciones de indiferencia (Don't Care) - 3 SP

### Épica 4: Códigos, Detección y Corrección de Errores (16 SP)
Protocolos de codificación y verificación de integridad.
- **HU-4.1**: Códigos numéricos y de caracteres - 5 SP
- **HU-4.2**: Verificación de paridad - 3 SP
- **HU-4.3**: Hamming y CRC - 8 SP

### Épica 5: Simulador de Escenarios (8 SP)
Integración de conceptos en entorno práctico.
- **HU-5.1**: Escenario del Termómetro Digital - 8 SP (BLOQUEADA)

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Testing**: Jest, Playwright, React Testing Library
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Build**: Turbopack

## 📦 Instalación

### Requisitos
- Node.js 18+ 
- npm 9+

### Pasos

1. **Clonar/Navegar al proyecto**
```bash
cd "Projecto F"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Acceder a `http://localhost:3000`

## 🧪 Testing

### Tests Unitarios (Jest)
```bash
npm run test                # Ejecutar tests
npm run test:watch         # Modo watch
npm run test:coverage      # Con cobertura
```

### Tests E2E (Playwright)
```bash
npm run test:e2e           # Ejecutar tests E2E
npm run test:e2e:debug     # Modo debug
npm run test:e2e:ui        # Interfaz visual
```

## 📊 Plan de Sprints

| Sprint | Semanas | Enfoque | SP | Estado |
|--------|---------|---------|----|---------| 
| Sprint 1 | 1-2 | Fundamentos de conversión | 19 | Próximo |
| Sprint 2 | 3-4 | Conversión avanzada + Aritmética signada | 28 | Planificado |
| Sprint 3 | 5-6 | Álgebra Booleana + Códigos | 21 | Planificado |
| Sprint 4 | 7-8 | Karnaugh avanzado + Integración | 21 | Planificado |

**Total Estimado**: 89 SP en 4-5 sprints de 2 semanas

## ⚠️ Riesgos Críticos

1. **Algoritmo de Karnaugh (HU-3.2)**: Complejidad en mapas de 5 variables
2. **Detección de períodos (HU-1.2)**: Fracciones binarias periódicas
3. **Integración vertical (HU-5.1)**: Depende de E1, E2, E4 completadas
4. **Restricción de no usar funciones nativas**: Aumenta tiempo de desarrollo

## ✅ Definition of Done

- ✓ Algoritmo implementado sin funciones nativas del lenguaje
- ✓ Tests unitarios cubriendo ejemplos de la cátedra
- ✓ Paso a paso del algoritmo visible en la interfaz
- ✓ Módulo diseñado para extensibilidad futura
- ✓ Revisado y aprobado por el Product Owner
- ✓ Responsive en navegadores modernos
- ✓ Code review completado
- ✓ Desplegado en staging

## 📚 Referencias

- **Material de Cátedra**: Tecnicatura TUDS - Matemática Discreta
- **Análisis de Backlog**: Documento HTML del Scrum Master
- **Briefing del PO**: Especificaciones de requisitos

## 👥 Equipo

- **Product Owner**: Define requerimientos y criterios de aceptación
- **Scrum Master**: Gestiona backlog y mitigación de riesgos
- **Equipo de Desarrollo**: Implementa según DoD

## 📝 Licencia

Proyecto educativo - Tecnicatura Universitaria en Desarrollo de Software (TUDS)

---

**Última actualización**: Abril 2026  
**Versión**: 1.0 - MVP
