import type { GlossaryTerm } from '@/types/glossary';

export const glossaryByModule: Record<string, GlossaryTerm[]> = {
  conversiones: [
    {
      term: 'Base (b)',
      definition: 'Número entero mayor a 1 que define la cantidad de caracteres distintos en un sistema numérico posicional. Ejemplo: b=2 para binario, b=16 para hexadecimal.',
    },
    {
      term: 'BIT',
      definition: 'Acrónimo de BInary digiT. Es el carácter individual del sistema binario, que solo puede valer 0 o 1.',
    },
    {
      term: 'MSB',
      definition: 'Most Significative Bit (Bit más significativo). Es el bit situado más a la izquierda en una representación binaria; posee el mayor valor posicional.',
    },
    {
      term: 'LSB',
      definition: 'Least Significative Bit (Bit menos significativo). Es el bit situado más a la derecha en una representación binaria; posee el menor valor posicional.',
    },
    {
      term: 'Sistema Posicional',
      definition: 'Método de representación numérica donde el valor de cada dígito depende de su posición relativa respecto a la base.',
    },
    {
      term: 'Sistema Octal',
      definition: 'Sistema de base 8 que utiliza los caracteres del 0 al 7. Frecuentemente usado como ayuda auxiliar para leer representaciones binarias, por ejemplo en permisos de UNIX/Linux.',
    },
    {
      term: 'Sistema Hexadecimal',
      definition: 'Sistema de base 16 que utiliza dígitos del 0 al 9 y letras de la A a la F para representar valores de forma compacta. Ampliamente usado en direcciones de memoria.',
    },
    {
      term: 'Residuo',
      definition: 'El sobrante de una división entera. En el método de divisiones sucesivas, los residuos leídos de abajo hacia arriba forman el número en la base destino.',
    },
    {
      term: 'Resolución',
      definition: 'Capacidad de detalle de un sistema que depende de la cantidad de caracteres disponibles en su representación numérica. A mayor cantidad de bits, mayor resolución.',
    },
    {
      term: 'Precisión',
      definition: 'Indicador de qué tan cercano es el valor representado en un sistema al valor real del evento que se está midiendo.',
    },
    {
      term: 'Método de Potencias',
      definition: 'Procedimiento para convertir un número de cualquier base a decimal aplicando su representación polinomial: N = Σ dígito × base^posición.',
    },
    {
      term: 'Circuito Digital',
      definition: 'Sistema electrónico que procesa información representada en sistema binario. Es generalmente más simple, rápido y preciso que los circuitos analógicos.',
    },
  ],

  signados: [
    {
      term: 'Signed (Con signo)',
      definition: 'Representación numérica que permite expresar tanto valores positivos como negativos mediante un bit de signo o técnicas de codificación.',
    },
    {
      term: 'Unsigned (Sin signo)',
      definition: 'Representación numérica que no contempla valores negativos, permitiendo un rango mayor de números positivos con la misma cantidad de bits.',
    },
    {
      term: 'Signo y Magnitud',
      definition: 'Método que utiliza el MSB como bit de signo (0=positivo, 1=negativo) y los bits restantes para representar el valor absoluto del número.',
    },
    {
      term: 'Complemento a 1',
      definition: 'Método de representación de números negativos que consiste en invertir todos los bits del número positivo correspondiente. Tiene el problema del doble cero.',
    },
    {
      term: 'Complemento a 2',
      definition: 'Método de representación signada que se obtiene sumando 1 al Complemento a 1. Es el estándar actual en sistemas digitales por tener un solo cero y simplificar la aritmética.',
    },
    {
      term: 'Exceso a K',
      definition: 'Forma de representar números con signo sumando una constante k (usualmente 2^(n-1) o 2^(n-1)-1) a cada número, permitiendo tratar todos los valores como binarios positivos.',
    },
    {
      term: 'Doble Cero',
      definition: 'Problema presente en Signo y Magnitud y Complemento a 1: existen dos representaciones distintas para el valor cero (+0 y -0), lo que complica las operaciones aritméticas.',
    },
    {
      term: 'Magnitud',
      definition: 'El valor absoluto de un número, independientemente de su signo.',
    },
    {
      term: 'Overflow (Desbordamiento)',
      definition: 'Error que ocurre cuando el resultado de una operación aritmética excede el rango máximo representable con la cantidad de bits disponibles.',
    },
  ],

  booleana: [
    {
      term: 'Álgebra de Boole',
      definition: 'Sistema algebraico que utiliza variables lógicas y operaciones fundamentales (AND, OR, NOT) para simplificar circuitos y representar procesos lógicos. Base teórica de las computadoras digitales.',
    },
    {
      term: 'Tabla de Verdad',
      definition: 'Herramienta gráfica que enumera sistemáticamente todas las combinaciones posibles de entrada (2^n filas para n variables) y sus salidas resultantes.',
    },
    {
      term: 'Mintérmino (mᵢ)',
      definition: 'Término canónico de producto (AND) donde las variables se combinan; las variables complementadas se representan con 0 y las no complementadas con 1 en el índice binario.',
    },
    {
      term: 'Maxtérmino (Mᵢ)',
      definition: 'Término canónico de suma (OR) donde las variables se combinan; las variables complementadas se representan con 1 y las no complementadas con 0 en el índice binario.',
    },
    {
      term: 'Forma Canónica',
      definition: 'Representación única y normalizada de una función lógica. Existen dos tipos: Suma de Mintérminos (SOP) y Producto de Maxtérminos (POS).',
    },
    {
      term: 'Primo Implicante',
      definition: 'Agrupación máxima de celdas adyacentes (potencia de 2) en un diagrama de Karnaugh que no puede ser contenida en una agrupación más grande.',
    },
    {
      term: 'Primo Implicante Esencial',
      definition: 'Agrupación indispensable en el diagrama K porque contiene al menos un compartimiento que no puede ser cubierto por ninguna otra agrupación.',
    },
    {
      term: 'Don\'t Care (X)',
      definition: 'Condición de "no importa" en funciones incompletamente especificadas. Pueden usarse como 0 o 1 para maximizar la simplificación en el diagrama de Karnaugh.',
    },
    {
      term: 'Diagrama de Karnaugh',
      definition: 'Método gráfico para simplificar funciones booleanas. Asocia una celda a cada fila de la tabla de verdad y permite identificar visualmente agrupaciones para reducir literales.',
    },
    {
      term: 'Compuerta Universal',
      definition: 'Compuerta lógica (NAND o NOR) que posee la capacidad de replicar cualquier otra función lógica fundamental, permitiendo implementar cualquier circuito con un solo tipo de compuerta.',
    },
    {
      term: 'Glitch',
      definition: 'Pulso eléctrico no deseado y de corta duración que aparece en la salida de un circuito debido a retrasos de propagación entre compuertas.',
    },
    {
      term: 'Hazard (Azar)',
      definition: 'Condición estructural en un circuito lógico que puede provocar la aparición de glitches durante el cambio de variables de entrada.',
    },
    {
      term: 'Leyes de De Morgan',
      definition: 'Teoremas que permiten distribuir una negación: ̄(A·B) = Ā+B̄ y ̄(A+B) = Ā·B̄. Fundamentales para transformar entre formas SOP y POS.',
    },
    {
      term: 'Simplificación Algebraica',
      definition: 'Proceso de reducir la complejidad de una función lógica aplicando teoremas y leyes del álgebra de Boole para obtener expresiones con menos literales.',
    },
  ],

  errores: [
    {
      term: 'Código',
      definition: 'Sistema de reglas diseñado para representar datos (letras, números, símbolos) de forma que puedan ser procesados por computadoras de manera estructurada, eficiente y confiable.',
    },
    {
      term: 'BCD (Binary Coded Decimal)',
      definition: 'Sistema donde cada dígito decimal (0-9) es codificado por separado en un grupo de 4 bits binarios. Facilita la visualización en pantallas decimales.',
    },
    {
      term: 'Código Gray',
      definition: 'Sistema de codificación binaria donde dos valores consecutivos difieren únicamente en la posición de un bit. Evita lecturas erróneas en sensores de posición.',
    },
    {
      term: 'ASCII',
      definition: 'American Standard Code for Information Interchange. Estándar de 7 bits (128 caracteres) o 8 bits (256 caracteres) para intercambio de texto entre computadoras. Principalmente para el idioma inglés.',
    },
    {
      term: 'Unicode',
      definition: 'Estándar de codificación universal que asigna un código único a cada carácter de prácticamente todos los idiomas del mundo, incluyendo símbolos especiales y emojis. Soporta más de un millón de códigos.',
    },
    {
      term: 'Bit de Paridad',
      definition: 'Bit adicional añadido a una secuencia para que el número total de "1" sea par o impar. Detecta errores simples (1 bit) pero no los corrige ni los ubica.',
    },
    {
      term: 'Código Hamming',
      definition: 'Técnica que inserta bits de paridad en posiciones potencias de 2 (1, 2, 4...). Permite no solo detectar errores de 1 bit sino también corregirlos automáticamente.',
    },
    {
      term: 'CRC (Cyclic Redundancy Check)',
      definition: 'Algoritmo de detección de errores basado en la división polinómica (XOR) de la secuencia de datos por un polinomio generador. El resto de la división se adjunta como verificación.',
    },
    {
      term: 'Polinomio Generador',
      definition: 'Número binario utilizado en el proceso de CRC para realizar la división XOR y obtener el resto de verificación.',
    },
    {
      term: 'Error Simple',
      definition: 'Error en una cadena de datos donde un único bit tiene un valor incorrecto.',
    },
    {
      term: 'Error Múltiple',
      definition: 'Error en una cadena de datos donde más de un bit es incorrecto simultáneamente durante la transmisión o el almacenamiento.',
    },
    {
      term: 'Memoria ECC',
      definition: 'Error Correcting Code: tipo de memoria RAM que utiliza el Código Hamming para detectar y corregir automáticamente errores de 1 bit. Esencial en servidores y sistemas críticos.',
    },
    {
      term: 'Exceso-K (Biased)',
      definition: 'Método de representación numérica que suma un valor fijo (K) a los números para desplazar su representación, facilitando el manejo de signos en sistemas digitales.',
    },
  ],
};
