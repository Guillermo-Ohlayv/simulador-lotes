# Análisis Detallado de ProcesamientoLotes.jsx

## Estructura General del Componente

### Estados Principales
- `simulador`: Instancia de la clase Simulador que maneja toda la lógica de simulación
- `estaCapturando`: Boolean que controla si estamos en fase de captura o simulación
- `tick`: Contador que fuerza re-renders cuando cambia el estado
- `estaEjecutando`: Boolean que controla si la simulación está corriendo

### useEffect - Control de Simulación
```javascript
useEffect(() => {
  let intervalo;
  if (estaEjecutando && !simulador.estaCapturando) {
    intervalo = setInterval(() => {
      simulador.ejecutarPaso();
      setTick(prev => prev + 1);
      
      if (!simulador.procesoActual) {
        setEstaEjecutando(false);
      }
    }, 1000);
  }
  return () => clearInterval(intervalo);
}, [estaEjecutando, simulador]);
```

**Funcionamiento:**
- Se ejecuta cada segundo cuando `estaEjecutando` es true
- Llama a `simulador.ejecutarPaso()` que avanza la simulación
- Incrementa `tick` para forzar re-render
- Si no hay proceso actual, detiene la simulación

## Funciones de Control

### agregarProceso(datosProceso)
- Llama a `simulador.agregarProceso()` para agregar un proceso al lote
- Incrementa `tick` para actualizar la UI

### iniciarSimulacion()
- Cambia `estaCapturando` a false
- Llama a `simulador.iniciarSimulacion()` para comenzar
- Activa `estaEjecutando` para iniciar el intervalo
- Incrementa `tick`

### finalizarCaptura()
- Solo cambia `estaCapturando` a false

## Variables Calculadas

### procesosLoteActual
```javascript
const procesosLoteActual = simulador.loteActualProcesosOriginales || [];
```
- Contiene todos los procesos del lote actual (máximo 4)
- `loteActualProcesosOriginales` se actualiza en el simulador cuando cambia de lote

### procesosAgregados y lotesLlenos
- Calculan estadísticas para el formulario de captura

### procesosTerminadosPorLote
```javascript
const procesosTerminadosPorLote = {};
simulador.terminados.forEach(proceso => {
  const loteIndex = Math.floor(proceso.id / 4) + 1;
  if (!procesosTerminadosPorLote[loteIndex]) {
    procesosTerminadosPorLote[loteIndex] = [];
  }
  procesosTerminadosPorLote[loteIndex].push(proceso);
});
```
- Agrupa procesos terminados por lote
- **PROBLEMA**: Usa `Math.floor(proceso.id / 4) + 1` que es una estimación incorrecta

## ANÁLISIS DETALLADO DE LA TABLA

### Estructura de la Tabla
```javascript
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', 
  gap: 8,
  border: '1px solid #ccc',
  padding: 8
}}>
```

### Columnas:
1. **Lote Trabajando**: Muestra "Lote X (TMEs)"
2. **Proceso en ejecución**: Nombre, ID, Operación
3. **Tiempo transcurrido**: Segundos transcurridos
4. **Tiempo restante**: TME - tiempo transcurrido
5. **Procesos Terminados**: Lista de procesos completados

### Lógica de Renderizado de Filas

#### Caso 1: No hay lote trabajando
```javascript
{procesosLoteActual.length === 0 ? (
  <>
    <div>No lote trabajando</div>
    <div>-</div>
    <div>-</div>
    <div>-</div>
    <div>-</div>
  </>
) : (
  // Renderizar filas de procesos
)}
```

#### Caso 2: Hay procesos en el lote actual
```javascript
procesosLoteActual.map((proceso, index) => (
  <React.Fragment key={proceso.id}>
    // Una fila por cada proceso
  </React.Fragment>
))
```

### Lógica Compleja por Columna

#### Columna "Lote Trabajando"
```javascript
<div>Lote {simulador.loteActual.id} ({proceso.tme}s)</div>
```
- **PROBLEMA**: `simulador.loteActual.id` puede no existir o ser undefined

#### Columna "Proceso en ejecución"
```javascript
{index === 0 ? (
  simulador.procesoActual ? (
    // Mostrar proceso actual (el que se está ejecutando)
  ) : (
    // Mostrar primer proceso del lote
  )
) : (
  // Mostrar proceso específico de la fila
)}
```

**Lógica:**
- Si es la primera fila (index === 0):
  - Si hay proceso actual: muestra el proceso que se está ejecutando
  - Si no hay proceso actual: muestra el primer proceso del lote
- Si no es la primera fila: muestra el proceso específico de esa fila

#### Columnas "Tiempo transcurrido" y "Tiempo restante"
```javascript
{index === 0 && simulador.procesoActual ? 
  `${simulador.procesoActual.tiempoTranscurrido}s` : 
  `${proceso.tiempoTranscurrido}s`
}
```

**Lógica:**
- Si es la primera fila Y hay proceso actual: usa datos del proceso actual
- En cualquier otro caso: usa datos del proceso de la fila

#### Columna "Procesos Terminados"
```javascript
{index === 0 && simulador.terminados.length > 0 ? (
  // Mostrar últimos 3 procesos terminados
) : (
  simulador.terminados.length > 0 ? (
    // Mostrar últimos 3 procesos terminados (duplicado)
  ) : (
    '-'
  )
)}
```

**PROBLEMAS IDENTIFICADOS:**

1. **Lógica Redundante**: La columna "Procesos Terminados" tiene lógica duplicada
2. **Inconsistencia**: Solo la primera fila muestra procesos terminados, las otras filas están vacías
3. **Referencia Incorrecta**: `simulador.loteActual.id` puede ser undefined
4. **Agrupación Incorrecta**: `procesosTerminadosPorLote` usa estimación incorrecta del lote

## Flujo de Datos

1. **Captura**: Los procesos se agregan a lotes en el simulador
2. **Inicio**: Se toma el primer lote y se convierte en lote actual
3. **Ejecución**: Se ejecuta un proceso a la vez del lote actual
4. **Finalización**: Cuando un proceso termina, se mueve a `terminados`
5. **Siguiente**: Se toma el siguiente proceso del lote actual
6. **Cambio de Lote**: Cuando se acaba un lote, se toma el siguiente

## Problemas de Diseño

1. **Mezcla de Responsabilidades**: La tabla intenta mostrar tanto el estado actual como el histórico
2. **Lógica Condicional Compleja**: Demasiadas condiciones anidadas
3. **Duplicación de Datos**: Los procesos terminados se muestran en múltiples lugares
4. **Falta de Claridad**: No está claro qué representa cada fila

## Sugerencias de Mejora

1. **Simplificar la Lógica**: Cada fila debería representar un proceso específico
2. **Separar Estados**: Mostrar proceso actual y procesos del lote por separado
3. **Corregir Referencias**: Usar `simulador.lotesProcesados + 1` en lugar de `simulador.loteActual.id`
4. **Eliminar Duplicación**: Mostrar procesos terminados solo una vez
5. **Clarificar Propósito**: Cada columna debería tener un propósito claro y único

