# Proyecto F - Plataforma Educativa TUDS

Plataforma interactiva para la enseñanza de **Matemática Discreta y Diseño Lógico** en la Tecnicatura Universitaria en Desarrollo de Software (TUDS).
# Como iniciar el servidor

1. Entra al directorio del proyecto
cd proyecto-f
2. Instala las dependencias
(Esto descarga todas las librerías necesarias - puede tardar 1-2 minutos)
npm install
3. Levanta el servidor de desarrollo
npm run dev
4. Abre en tu navegador
Ve a: http://localhost:3000

## 📋 Descripción

Esta plataforma proporciona herramientas interactivas para aprender:
- **Conversiones numéricas** (decimal ↔ binario/octal/hexadecimal)
- **Números signados** (signo-magnitud, complementos, exceso-K)
- **Álgebra booleana** (formas canónicas, mapas de Karnaugh)
- **Códigos de error** (BCD, Gray, ASCII, paridad, Hamming, CRC)
- **Simulador de escenarios** (termómetro digital y más)

Con visualización paso a paso de algoritmos y explicaciones detalladas.

## 🛠️ Requisitos previos

- **Node.js** 18+ o superior
- **npm** 9+ o **yarn**/pnpm

## 📦 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/proyecto-f.git
cd proyecto-f

# 2. Instalar dependencias
npm install

# O con yarn
yarn install
```

## 🚀 Uso

### Modo desarrollo (con hot reload)
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para producción
```bash
npm run build
```

### Ejecutar en producción
```bash
npm run start
```

## 🧪 Tests

### Tests unitarios
```bash
npm test              # Una sola ejecución
npm run test:watch   # Modo watch
npm run test:coverage # Con cobertura (objetivo: 80%)
```

### Tests E2E (Playwright)
```bash
npm run test:e2e      # Ejecutar
npm run test:e2e:ui   # Con interfaz visual
npm run test:e2e:debug # Modo debug
```

## 📊 Verificación de código

```bash
npm run lint   # ESLint + TypeScript strict mode
```

## 📁 Estructura del proyecto

```
proyecto-f/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # Componentes React reutilizables
│   ├── types/            # Tipos TypeScript por módulo
│   └── styles/           # Estilos globales (Tailwind)
├── tests/
│   └── unit/             # Tests Jest
├── public/               # Archivos estáticos
├── jest.config.js        # Configuración Jest
├── playwright.config.ts  # Configuración Playwright
├── tailwind.config.ts    # Configuración Tailwind CSS
└── tsconfig.json         # Configuración TypeScript (strict mode)
```

## 🎓 Restricciones pedagógicas

**⚠️ IMPORTANTE**: Esta plataforma NO utiliza funciones nativas de conversión (`parseInt`, `toString`, etc.). Todos los algoritmos se implementan desde cero para fines educativos, con visualización paso a paso del proceso.

Esto permite que los estudiantes entiendan cómo funcionan realmente las conversiones numéricas.

## 🏗️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14.2.3 |
| UI | React 18.3.1 + TypeScript 5.4.3 |
| Estilos | Tailwind CSS + Framer Motion |
| Gráficos | Recharts |
| Estado | Zustand |
| Testing | Jest + Playwright |
| Linting | ESLint + TypeScript strict |

## 📅 Estado actual (Sprint 1)

✅ **Completado:**
- Infraestructura y configuración
- Algoritmos de conversión numérica (HU-1.1 a 1.4)
- Tests unitarios
- Stubs de páginas para 5 épicas

⏳ **Por hacer:**
- Épicas 2-5 (números signados, álgebra booleana, códigos de error, simulador)

## 📞 Contribuciones

Este es un proyecto educativo. Si encuentras bugs o tienes sugerencias:
1. Abre un issue describiendo el problema
2. Si contribuyes código, asegúrate de respetar la restricción pedagógica (no usar funciones nativas de conversión)

---

**Hecho para TUDS** 🎓
