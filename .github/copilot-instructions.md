<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

# Proyecto F - Instrucciones Personalizadas

## Visión General

Este es un proyecto educativo para la **Tecnicatura Universitaria en Desarrollo de Software (TUDS)** - Plataforma de **Matemática Discreta y Diseño Lógico**.

## Estructura por Épicas

El proyecto está organizado en **5 épicas** con **14 historias de usuario**:

1. **Conversiones Numéricas** - Bases decimal, binaria, octal, hexadecimal
2. **Números Signados** - Representación con signo, complementos, exceso
3. **Álgebra Booleana** - Formas canónicas, mapas K, don't cares
4. **Códigos y Errores** - BCD, Gray, Hamming, CRC
5. **Simulador** - Escenario integrado (Termómetro Digital)

## Notas Técnicas Críticas

### ⚠️ Restricciones Obligatorias

1. **NO usar funciones nativas de conversión** del lenguaje (parseInt, toString, etc.)
   - Todo algoritmo debe implementarse desde cero
   - Documentar paso a paso en la interfaz
   
2. **Métodos específicos requeridos**:
   - Conversión: Divisiones/Multiplicaciones Sucesivas
   - Karnaugh: Agrupación de primos implicantes
   - Hamming/CRC: Implementación estándar con polinomios configurables

### 📊 Riesgos Críticos a Monitorear

- **HU-3.2 (Karnaugh)**: 13 SP, requiere división en 2 sub-historias
- **HU-1.2 (Fracciones)**: Detección de períodos es costosa
- **HU-5.1 (Integración)**: BLOQUEADA hasta que E1, E2, E4 estén Done

### ✅ Definition of Done Obligatorio

- Algoritmo sin funciones nativas
- Tests unitarios con casos de la cátedra
- Interfaz mostrando pasos del algoritmo
- Diseño extensible (parámetros, no hardcode)
- Code review y aprobación del PO
- Tests unitarios: mínimo 80% cobertura

## Convenciones de Código

### Estructura de Módulos

```
src/modules/[nombre-epica]/
├── components/      # Componentes React
├── hooks/          # Custom hooks
├── lib/
│   ├── algorithms/ # Implementación de algoritmos
│   └── types.ts    # Tipos específicos
└── utils/          # Utilidades del módulo
```

### Nombrado de Archivos

- Componentes: `PascalCase` + `.tsx`
- Algoritmos: `camelCase` + `.ts`
- Tests: `*.test.ts` o `*.spec.ts`

### TypeScript Requerido

- Strict mode activado
- No usar `any` (usar `unknown` con type guards)
- Interfaz explícita para todos los tipos complejos
- Documentar funciones públicas con JSDoc

## Flujo de Desarrollo

1. **Sprint Planning**: Refinamiento de HU
2. **Desarrollo**: Implementar según criterios de aceptación
3. **Testing**: Unitarios + E2E antes de merge
4. **Review**: Code review + validación del PO
5. **Staging**: Desplegar en ambiente de prueba
6. **Sprint Review**: Demo y retroalimentación

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor (puerto 3000)
npm run build           # Build para producción
npm run lint            # Linting

# Testing
npm run test            # Jest unitarios
npm run test:watch      # Modo watch
npm run test:coverage   # Con coverage
npm run test:e2e        # Playwright E2E

# Análisis
npm run type-check      # TypeScript check
npm run analyze         # Bundle analysis
```

## Referencias Importantes

- **Briefing PO**: Documento con especificaciones completas
- **Análisis SM**: HTML interactivo con backlog detallado
- **Material Cátedra**: Ejemplos y casos de prueba validados

## Preguntas Comunes

**P: ¿Puedo usar librerías de matemática booleana?**  
R: No. Todos los algoritmos deben implementarse. Puedes usar utilidades de visualización (recharts, etc.)

**P: ¿Cuál es la prioridad en Sprint 1?**  
R: HU-1.1, HU-1.3, HU-1.4, inicio de HU-1.2 (19 SP)

**P: ¿Cuándo entra HU-5.1 (Termómetro)?**  
R: Sprint 4 mínimo. SOLO cuando E1, E2, E4 estén 100% Done.

---

**Proyecto**: Matemática Discreta & Diseño Lógico  
**Versión**: 1.0 - MVP  
**Última actualización**: Abril 2026
