import type { QuizQuestion } from '@/types/quiz';

export const quizByModule: Record<string, QuizQuestion[]> = {
  conversiones: [
    {
      id: 'conv-1',
      question: '¿En qué consiste el método de divisiones sucesivas para convertir un número decimal entero a otra base?',
      answer: 'Dividir el número decimal entre la base destino (2, 8 o 16) de forma reiterada hasta que el cociente sea cero. El resultado final se obtiene leyendo los residuos generados en cada división de abajo hacia arriba.',
    },
    {
      id: 'conv-2',
      question: '¿Cómo se convierte la parte fraccionaria de un número decimal a base binaria?',
      answer: 'Se multiplica la parte decimal por la base destino y se anota la parte entera del resultado. Este proceso se repite hasta que dé cero, se vuelva periódico, o se alcance la cantidad de bits deseada. Los bits se leen de arriba hacia abajo.',
    },
    {
      id: 'conv-3',
      question: '¿Cómo funciona el método de restas sucesivas para obtener un número binario?',
      answer: 'Se usa una tabla de potencias de 2. Se coloca un 1 en la mayor potencia menor o igual al número y se resta ese valor. El proceso se repite con el remanente, colocando un 0 en las posiciones de potencias no utilizadas.',
    },
    {
      id: 'conv-4',
      question: '¿Cuál es el procedimiento para convertir un número de base 2 a octal (2³) o hexadecimal (2⁴)?',
      answer: 'Para octal: agrupar los bits de a 3 partiendo desde la derecha (agregando ceros a la izquierda si es necesario) y convertir cada grupo. Para hexadecimal: procedimiento idéntico pero agrupando de a 4 bits.',
    },
    {
      id: 'conv-5',
      question: '¿Cómo se define la representación de un sistema numérico en forma polinomial?',
      answer: 'Un sistema numérico posicional se representa mediante la suma del producto de cada dígito (aᵢ) por la base (b) elevada a su posición (i): N = Σ aᵢ × bⁱ. Separa el número en parte entera (exponentes positivos) y fraccionaria (exponentes negativos).',
    },
    {
      id: 'conv-6',
      question: '¿Qué representan los términos MSB y LSB en el sistema binario?',
      answer: 'MSB (Most Significative Bit) es el bit más significativo, ubicado en el extremo izquierdo. LSB (Least Significative Bit) es el bit menos significativo, ubicado en el extremo derecho.',
    },
    {
      id: 'conv-7',
      question: '¿Por qué los sistemas digitales prefieren la base 2 sobre la base 10?',
      answer: 'Por la simplicidad de construir circuitos que solo manejen dos estados: alto (1) y bajo (0). Son fáciles de representar como un interruptor encendido/apagado.',
    },
    {
      id: 'conv-8',
      question: '¿Qué ventaja ofrece el sistema hexadecimal sobre el binario en la programación?',
      answer: 'Permite representar números grandes de forma más compacta y legible. Es ampliamente usado para gestionar direcciones de memoria y datos, siendo soportado por lenguajes como C, Pascal y Basic.',
    },
  ],

  signados: [
    {
      id: 'sign-1',
      question: '¿Qué diferencia fundamental existe entre la representación unsigned y signed?',
      answer: 'Los números sin signo (unsigned) solo representan valores positivos o cero, usando todos sus bits para la magnitud. Los con signo (signed) permiten representar positivos y negativos mediante métodos de codificación como Signo y Magnitud, Complemento a 1, Complemento a 2 o Exceso a K.',
    },
    {
      id: 'sign-2',
      question: 'En el método de Signo y Magnitud, ¿cómo se determina el signo de un número?',
      answer: 'Se utiliza el bit más significativo (MSB) como indicador: 0 para positivo y 1 para negativo. Los bits restantes representan la magnitud del número en valor absoluto.',
    },
    {
      id: 'sign-3',
      question: '¿Cuál es la principal desventaja compartida por Signo y Magnitud y Complemento a 1?',
      answer: 'Ambos métodos presentan el problema del "doble cero": poseen una representación distinta para +0 y -0 (por ejemplo, 0000 y 1000 en Signo y Magnitud). Esto complica las operaciones aritméticas y el diseño de los circuitos.',
    },
    {
      id: 'sign-4',
      question: '¿Cuáles son los pasos para representar un número negativo en Complemento a 2?',
      answer: 'Primero se asigna el bit de signo (1 para negativo). Luego se expresan los bits restantes en Complemento a 1 (invirtiendo sus valores). Finalmente se suma 1 al resultado. Es el método estándar en la computación moderna.',
    },
    {
      id: 'sign-5',
      question: '¿Qué caracteriza al método de Exceso a K y cómo se calcula el valor codificado?',
      answer: 'Consiste en desplazar el rango hacia los positivos sumando una constante k a cada número, eliminando la necesidad de un bit de signo explícito. El valor codificado es igual al valor real más la constante k (usualmente 2^(n-1) o 2^(n-1)-1).',
    },
    {
      id: 'sign-6',
      question: '¿Cuál es la ventaja operativa del Complemento a 2 frente a otros métodos?',
      answer: 'Posee un solo cero y simplifica significativamente las operaciones de suma y resta en los sistemas digitales. Es el estándar más utilizado actualmente debido a su eficiencia operativa.',
    },
    {
      id: 'sign-7',
      question: '¿Cuál es el rango de valores representables con n bits en Complemento a 2?',
      answer: 'El rango es asimétrico: de -2^(n-1) hasta 2^(n-1)-1. Por ejemplo, con 8 bits: de -128 a +127. Esta asimetría se debe a que existe un solo cero, dejando un valor negativo adicional sin par positivo.',
    },
  ],

  booleana: [
    {
      id: 'bool-1',
      question: '¿Cuál es la idea clave detrás de la lógica binaria en los sistemas digitales?',
      answer: 'Todo sistema digital opera bajo dualidad absoluta: solo existen dos estados, 0 (Falso) y 1 (Verdadero). A diferencia del mundo real, no existen puntos intermedios; todo se define como un "sí" o un "no".',
    },
    {
      id: 'bool-2',
      question: '¿Bajo qué condición produce salida 1 la operación AND?',
      answer: 'La operación AND produce salida 1 únicamente si todas las condiciones de entrada son 1 simultáneamente. Basta con que una sola entrada sea 0 para que la salida sea 0.',
    },
    {
      id: 'bool-3',
      question: 'Describa la operación XOR y sus propiedades con los valores 0 y 1.',
      answer: 'XOR produce salida 1 solo cuando las entradas son diferentes. Propiedades: a ⊕ 0 = a (identidad) y a ⊕ 1 = ā (complemento). Es útil para detección de cambios y operaciones de suma binaria.',
    },
    {
      id: 'bool-4',
      question: '¿Qué establecen las Leyes de De Morgan?',
      answer: 'El complemento de un producto es la suma de los complementos: ̄(A·B) = Ā+B̄. El complemento de una suma es el producto de los complementos: ̄(A+B) = Ā·B̄. Permiten distribuir una negación que afecta a una expresión completa.',
    },
    {
      id: 'bool-5',
      question: '¿Qué define a una representación en forma canónica dentro del álgebra booleana?',
      answer: 'Una función puede tener infinitas representaciones, pero solo una única forma canónica. Esta forma se divide en dos tipos: Suma de Mintérminos (SOP) o Producto de Maxtérminos (POS).',
    },
    {
      id: 'bool-6',
      question: '¿Cuál es la diferencia principal entre mintérmino y maxtérmino?',
      answer: 'En los mintérminos, las variables complementadas se representan con 0 y las no complementadas con 1. En los maxtérminos es al revés: 1 para variables complementadas y 0 para las no complementadas.',
    },
    {
      id: 'bool-7',
      question: '¿Qué es un diagrama de Karnaugh y para cuántas variables es aplicable?',
      answer: 'Es una figura geométrica que asocia una región o "compartimiento" a cada fila de la tabla de verdad. Se utiliza como método visual para simplificar funciones lógicas de 1 a 5 variables.',
    },
    {
      id: 'bool-8',
      question: '¿Cuál es la distinción entre primo implicante esencial y no esencial?',
      answer: 'Los esenciales son agrupaciones que contienen al menos un compartimiento que no puede ser cubierto de ninguna otra forma; son obligatorios. Los no esenciales pueden omitirse si todos sus compartimientos ya están cubiertos por implicantes esenciales.',
    },
    {
      id: 'bool-9',
      question: '¿Cómo se tratan las condiciones "Don\'t Care" (X) en la simplificación con Karnaugh?',
      answer: 'Las X agrupadas se tratan como valor 1 para obtener una función más simplificada. Si su inclusión no ayuda a expandir un grupo, se les asigna valor 0. Permiten ampliar grupos y reducir literales.',
    },
    {
      id: 'bool-10',
      question: '¿Cuál es la regla fundamental sobre el número de celdas en un grupo de Karnaugh?',
      answer: 'El número de celdas en cada grupo debe ser obligatoriamente una potencia de 2: 1, 2, 4, 8 o 16. Grupos más grandes eliminan más variables, resultando en términos con menos literales y circuitos más económicos.',
    },
    {
      id: 'bool-11',
      question: '¿Por qué NAND y NOR se denominan "compuertas universales"?',
      answer: 'Porque cualquier función lógica puede implementarse exclusivamente con ellas, sin necesidad de AND, OR o NOT. Su uso es estratégico para minimizar la cantidad de circuitos integrados distintos en un diseño.',
    },
    {
      id: 'bool-12',
      question: '¿Qué es un Hazard (azar) en un circuito lógico?',
      answer: 'Es una condición estructural del diseño en la que el circuito tiene el potencial de generar un glitch (pulso no deseado de corta duración) durante el cambio de variables, debido a los retardos de propagación en las compuertas.',
    },
  ],

  errores: [
    {
      id: 'err-1',
      question: '¿Cuál es la característica principal del código BCD (Binary Coded Decimal)?',
      answer: 'Representa cada dígito decimal del 0 al 9 de forma individual mediante su equivalente binario de 4 bits. A diferencia del binario puro, facilita la visualización en pantallas decimales como relojes o calculadoras.',
    },
    {
      id: 'err-2',
      question: '¿Por qué el código Gray es fundamental en sensores de posición?',
      answer: 'Es un sistema reflexivo donde entre dos números consecutivos solo cambia un bit. Esto evita que los bits que no cambian simultáneamente en una señal mecánica generen valores intermedios incorrectos, reduciendo errores de lectura.',
    },
    {
      id: 'err-3',
      question: '¿Qué diferencia existe entre el código ASCII y el estándar Unicode?',
      answer: 'ASCII utiliza 7 u 8 bits para representar 128 o 256 caracteres, principalmente del idioma inglés. Unicode es universal con más de un millón de códigos, incluyendo múltiples idiomas, emojis y símbolos matemáticos.',
    },
    {
      id: 'err-4',
      question: '¿Cuál es la función del bit de paridad y cuáles son sus limitaciones?',
      answer: 'Se añade a una cadena para verificar la integridad mediante una convención par o impar. Solo detecta errores simples (1 bit), pero no permite corregirlos ni identificar su ubicación exacta.',
    },
    {
      id: 'err-5',
      question: '¿En qué consiste el Código Hamming para corrección de errores?',
      answer: 'Inserta bits de paridad en posiciones que son potencias de 2 (1, 2, 4...). Estos bits controlan grupos específicos del mensaje, permitiendo al receptor recalcular las paridades y, mediante la suma de las posiciones fallidas, identificar y corregir el bit erróneo.',
    },
    {
      id: 'err-6',
      question: '¿Qué es el CRC (Cyclic Redundancy Check) y cómo funciona?',
      answer: 'Trata el mensaje como un número binario y lo divide por un polinomio generador (mediante XOR). El resto de esta división se adjunta al mensaje para que el receptor verifique si el resultado final es cero, indicando ausencia de errores.',
    },
    {
      id: 'err-7',
      question: '¿Qué diferencia hay entre un error simple y un error múltiple?',
      answer: 'Un error simple ocurre cuando un único bit de la cadena es incorrecto. Un error múltiple se produce cuando la incorrección afecta a más de un bit simultáneamente durante la transmisión o el almacenamiento.',
    },
    {
      id: 'err-8',
      question: '¿Qué aplicación práctica tienen las memorias RAM ECC?',
      answer: 'Utilizan el Código Hamming para detectar y corregir automáticamente errores de un bit. Son esenciales en sistemas embebidos críticos y servidores donde la integridad de los datos almacenados es prioritaria.',
    },
  ],
};
