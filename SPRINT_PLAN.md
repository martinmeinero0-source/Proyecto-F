# Plan de Desarrollo por Sprints

## Overview

**Total Estimado**: 89 Story Points  
**Sprints**: 4-5 sprints de 2 semanas  
**Velocidad Recomendada**: 20-25 SP por sprint  
**Inicio**: Inmediato (Sprint 1)

---

## Sprint 1: Fundamentos de Conversión (19 SP)

**Semanas**: 1-2  
**Objetivo**: Implementar la base del sistema de conversión numérica

### Historias a Ejecutar

| ID | Título | SP | Método | Status |
|----|--------|----|---------| --------|
| HU-1.1 | Decimal → Otras bases (enteros) | 5 | Divisiones sucesivas | ⏳ TODO |
| HU-1.3 | Otras bases → Decimal | 3 | Potencias (polinomial) | ⏳ TODO |
| HU-1.4 | Conversiones directas | 3 | Agrupación de bits | ⏳ TODO |
| HU-1.2 | Decimal fraccionario (inicio) | 8 | Multiplicaciones sucesivas | ⏳ TODO |

### Actividades Clave

1. ✅ Crear estructura de módulos
2. 🔄 Implementar HU-1.1 (Decimal → Binario, Octal, Hex)
3. 🔄 Implementar HU-1.3 (Base → Decimal)
4. 🔄 Implementar HU-1.4 (Conversiones directas B↔O, B↔H)
5. 🔄 Iniciar HU-1.2 (fracciones - solo framework)
6. 🧪 Tests unitarios para los 3 primeros
7. 📝 Documentación de algoritmos

### Riesgos

- HU-1.2 puede no completarse en el sprint (complejidad)
- Falta de Node.js podría retrasar setup

### DoD Checklist

- ✓ Algoritmos sin funciones nativas (parseInt, toString)
- ✓ Tests unitarios con ejemplos de cátedra
- ✓ UI mostrando pasos del algoritmo
- ✓ Code review completado
- ✓ Responsive en Chrome/Firefox

---

## Sprint 2: Conversión Avanzada + Números Signados (28 SP)

**Semanas**: 3-4  
**Objetivo**: Completar conversiones y introducir representación de signos

### Historias a Ejecutar

| ID | Título | SP | Status |
|----|--------|----| --------|
| HU-1.2 | Decimal fraccionario (finalización) | 8 | ⏳ TODO |
| HU-1.5 | Método de restas sucesivas | 7 | ⏳ TODO |
| HU-2.1 | Magnitud y signo | 5 | ⏳ TODO |
| HU-2.2 | Complementos (1 y 2) | 8 | ⏳ TODO |
| HU-2.3 | Exceso a K | 5 | ⏳ TODO |

### Dependencias

- Requiere Sprint 1 completado
- Componentes base creados en Sprint 1

### Riesgos

- HU-1.2: Detección de períodos en fracciones
- HU-2.2: Requiere animaciones (complejidad UX)

---

## Sprint 3: Álgebra Booleana + Códigos (21 SP)

**Semanas**: 5-6  
**Objetivo**: Introducir lógica booleana y códigos de detección

### Historias a Ejecutar

| ID | Título | SP | Status |
|----|--------|----| --------|
| HU-3.1 | Formas canónicas (SOP/POS) | 5 | ⏳ TODO |
| HU-3.2a | Karnaugh: Renderizado interactivo | 8 | ⏳ TODO |
| HU-4.1 | Códigos numéricos (BCD, Gray, ASCII, UTF-16) | 5 | ⏳ TODO |
| HU-4.2 | Verificación de paridad | 3 | ⏳ TODO |

### Consideraciones

- **ATENCIÓN**: HU-3.2 dividida en sub-historias (renderizado vs algoritmo)
- HU-4.1 y HU-4.2 son independientes (posible paralelización)

### Riesgos

- **⚠️ CRÍTICO**: Algoritmo de Karnaugh muy complejo (13 SP total)
- Mapas de 5 variables requieren lógica especial

---

## Sprint 4: Karnaugh Avanzado + Hamming/CRC + Integración (21 SP)

**Semanas**: 7-8  
**Objetivo**: Completar álgebra booleana, códigos de corrección e iniciar integración

### Historias a Ejecutar

| ID | Título | SP | Status |
|----|--------|----| --------|
| HU-3.2b | Karnaugh: Algoritmo de primos implicantes | 5 | ⏳ TODO |
| HU-3.3 | Don't Care (X en mapas K) | 3 | ⏳ TODO |
| HU-4.3 | Hamming + CRC | 8 | ⏳ TODO |
| HU-5.1 | Termómetro Digital (inicio) | 8 | ⏳ BLOCKED |

### Estado de HU-5.1

🔒 **BLOQUEADA** - Solo desbloquea cuando:
- ✅ E1 (Conversiones) = DONE
- ✅ E2 (Números Signados) = DONE
- ✅ E4 (Códigos/Errores) = DONE

---

## Backlog Refinement

Antes de cada Sprint Planning:

1. 📋 Revisar con PO los criterios de aceptación
2. 📊 Validar estimaciones
3. 🔍 Identificar riesgos técnicos
4. 📚 Incluir ejemplos de la cátedra

### Notas Técnicas Críticas

#### HU-3.2 (Karnaugh)

**División recomendada en 2 sub-historias:**

- **HU-3.2a (8 SP)**: Renderizado del mapa interactivo
  - UI para grillas de 1-5 variables
  - Lógica de adyacencia visual
  - Click para seleccionar/deseleccionar celdas
  
- **HU-3.2b (5 SP)**: Algoritmo de primos implicantes
  - Detección automática de implicantes esenciales
  - Cálculo de forma simplificada
  - Sugerencia de agrupaciones óptimas

#### HU-1.2 (Fracciones Decimales)

**Consideraciones:**
- Implementar límite máximo de iteraciones (64 bits)
- Detectar períodos en expansiones binarias
- Mostrar "..." cuando se identifique período
- Validar casos de prueba con cátedra

#### HU-5.1 (Termómetro)

**Flujo propuesto:**
```
Entrada: Temperatura decimal (-50 a +50°C)
  ↓
Conversión a binario (con signo si es negativo)
  ↓
Representación en complemento a 2 (n-bits)
  ↓
Conversión a ASCII/Unicode
  ↓
Cálculo de Hamming o CRC
  ↓
Simulación de transmisión
  ↓
Salida: Pantalla digital virtual
```

---

## Métricas de Seguimiento

### Por Sprint

```
Sprint | Planned SP | Committed | Completed | Velocity
-------|-----------|-----------|-----------|----------
   1   |    19     |    --     |    --     |   --
   2   |    28     |    --     |    --     |   --
   3   |    21     |    --     |    --     |   --
   4   |    21     |    --     |    --     |   --
```

### Cobertura de Tests

- Mínimo 80% cobertura de código
- 100% cobertura de algoritmos críticos
- Tests E2E para flujos principales

---

## Definición de Hecho (Definition of Done)

### Técnico

- ✓ Implementación sin funciones nativas del lenguaje
- ✓ Tests unitarios con casos de cátedra
- ✓ Paso a paso visible en interfaz
- ✓ TypeScript strict mode sin `any`
- ✓ Componentes reutilizables y extensibles

### QA

- ✓ Code review aprobado
- ✓ Tests E2E verdes
- ✓ Responsive (Chrome, Firefox)
- ✓ Cobertura ≥ 80%

### Producto

- ✓ Criterios de aceptación completados
- ✓ Aprobado por PO
- ✓ Documentación actualizada
- ✓ Listo para demo en Sprint Review

---

## Notas Generales

- **Prioridad Sprint 1**: Establecer base sólida (conversiones)
- **Riesgos Críticos**: Karnaugh (HU-3.2), Períodos en fracciones (HU-1.2)
- **Paralelización**: HU-4.1 y HU-4.2 pueden hacerse en paralelo
- **Integración Vertical**: HU-5.1 solo entra cuando E1, E2, E4 estén Done
- **Comunicación**: Reuniones diarias de 15 min con Product Owner

---

**Actualizado**: Abril 2026  
**Scrum Master**: Equipo TUDS  
**Estado**: Listo para Sprint 1
