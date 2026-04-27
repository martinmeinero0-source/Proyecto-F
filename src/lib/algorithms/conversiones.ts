// Archivo de inicialización de algoritmos para conversión decimal a binario
// Usando el Método de Divisiones Sucesivas

export interface DivisionStep {
  number: number
  divisor: number
  quotient: number
  remainder: number
}

export interface ConversionSteps {
  steps: DivisionStep[]
  result: string
}

/**
 * Convierte un número decimal a binario usando el método de divisiones sucesivas
 * @param decimal - Número decimal a convertir
 * @returns Objeto con pasos y resultado
 * 
 * Ejemplo: decimalToBinary(26) → "11010"
 * Pasos:
 * 26 ÷ 2 = 13 resto 0
 * 13 ÷ 2 = 6 resto 1
 * 6 ÷ 2 = 3 resto 0
 * 3 ÷ 2 = 1 resto 1
 * 1 ÷ 2 = 0 resto 1
 * Leer de abajo hacia arriba: 11010
 */
export function decimalToBinary(decimal: number): ConversionSteps {
  if (decimal < 0) {
    throw new Error('Este método solo funciona con números positivos')
  }

  if (decimal === 0) {
    return {
      steps: [{ number: 0, divisor: 2, quotient: 0, remainder: 0 }],
      result: '0',
    }
  }

  const steps: DivisionStep[] = []
  let number = decimal

  while (number > 0) {
    const quotient = Math.floor(number / 2)
    const remainder = number % 2

    steps.push({
      number,
      divisor: 2,
      quotient,
      remainder,
    })

    number = quotient
  }

  // El resultado se lee de abajo hacia arriba (últimos restos primero)
  const result = steps.map(step => step.remainder).reverse().join('')

  return { steps, result }
}

/**
 * Convierte un número decimal a cualquier base usando el método de divisiones sucesivas
 * @param decimal - Número decimal
 * @param base - Base destino (2-36)
 * @returns Objeto con pasos y resultado
 */
export function decimalToBase(decimal: number, base: number): ConversionSteps {
  if (base < 2 || base > 36) {
    throw new Error('La base debe estar entre 2 y 36')
  }

  if (decimal < 0) {
    throw new Error('Este método solo funciona con números positivos')
  }

  if (decimal === 0) {
    return {
      steps: [{ number: 0, divisor: base, quotient: 0, remainder: 0 }],
      result: '0',
    }
  }

  const steps: DivisionStep[] = []
  let number = decimal

  while (number > 0) {
    const quotient = Math.floor(number / base)
    const remainder = number % base

    steps.push({
      number,
      divisor: base,
      quotient,
      remainder,
    })

    number = quotient
  }

  // Convertir restos a símbolos (0-9, A-Z)
  const symbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const result = steps
    .map(step => symbols[step.remainder])
    .reverse()
    .join('')

  return { steps, result }
}
