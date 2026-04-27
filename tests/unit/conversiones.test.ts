import { describe, it, expect } from '@jest/globals'
import { decimalToBinary, decimalToBase } from '@/lib/algorithms/conversiones'

describe('Algoritmos de Conversión Numérica', () => {
  describe('decimalToBinary', () => {
    it('debe convertir 0 a "0"', () => {
      const result = decimalToBinary(0)
      expect(result.result).toBe('0')
    })

    it('debe convertir 1 a "1"', () => {
      const result = decimalToBinary(1)
      expect(result.result).toBe('1')
    })

    it('debe convertir 26 a "11010"', () => {
      const result = decimalToBinary(26)
      expect(result.result).toBe('11010')
    })

    it('debe convertir 2025 a "11111101001" (ejemplo de cátedra)', () => {
      const result = decimalToBinary(2025)
      expect(result.result).toBe('11111101001')
    })

    it('debe convertir 255 a "11111111"', () => {
      const result = decimalToBinary(255)
      expect(result.result).toBe('11111111')
    })

    it('debe lanzar error para números negativos', () => {
      expect(() => decimalToBinary(-5)).toThrow()
    })

    it('debe registrar los pasos correctamente para 26', () => {
      const result = decimalToBinary(26)
      expect(result.steps.length).toBe(5)
      expect(result.steps[0]).toEqual({
        number: 26,
        divisor: 2,
        quotient: 13,
        remainder: 0,
      })
    })
  })

  describe('decimalToBase', () => {
    it('debe convertir decimal a binario (base 2)', () => {
      const result = decimalToBase(10, 2)
      expect(result.result).toBe('1010')
    })

    it('debe convertir decimal a octal (base 8)', () => {
      const result = decimalToBase(64, 8)
      expect(result.result).toBe('100')
    })

    it('debe convertir 26586 a hexadecimal (base 16) = "67DA"', () => {
      const result = decimalToBase(26586, 16)
      expect(result.result).toBe('67DA')
    })

    it('debe convertir 255 a hexadecimal = "FF"', () => {
      const result = decimalToBase(255, 16)
      expect(result.result).toBe('FF')
    })

    it('debe convertir 0 a cualquier base', () => {
      expect(decimalToBase(0, 2).result).toBe('0')
      expect(decimalToBase(0, 8).result).toBe('0')
      expect(decimalToBase(0, 16).result).toBe('0')
    })

    it('debe lanzar error para base < 2', () => {
      expect(() => decimalToBase(10, 1)).toThrow()
    })

    it('debe lanzar error para base > 36', () => {
      expect(() => decimalToBase(10, 37)).toThrow()
    })
  })
})
