import { useState, useCallback, useRef } from 'react';
import { Simulador } from '../models/Simulador';

export const useSimulador = () => {
  // Mantenemos la instancia del simulador en una ref para que persista
  const simuladorRef = useRef(new Simulador());
  
  // Estado de React que refleja el estado del simulador
  const [estado, setEstado] = useState(() => ({
    estaCapturando: true,
    estaEjecutando: false,
    loteActual: null,
    procesoActual: null,
    lotesPendientes: 0,
    contadorGlobal: 0,
    lotesProcesados: 0,
    lotesTerminados: [],
    historialLotes: []
  }));

  // Función para actualizar el estado basado en el simulador
  const actualizarEstado = useCallback(() => {
    const simulador = simuladorRef.current;
    const estadoSimulacion = simulador.getEstadoSimulacion();
    
    setEstado(prevEstado => ({
      ...prevEstado,
      loteActual: estadoSimulacion.loteActual,
      procesoActual: estadoSimulacion.procesoActual,
      lotesPendientes: estadoSimulacion.lotesPendientes,
      contadorGlobal: estadoSimulacion.contadorGlobal,
      lotesProcesados: estadoSimulacion.lotesProcesados,
      lotesTerminados: estadoSimulacion.lotesTerminados,
      historialLotes: simulador.getHistorialLotesArray()
    }));
  }, []);

  // Función para agregar un proceso
  const agregarProceso = useCallback((datosProceso) => {
    try {
      simuladorRef.current.agregarProceso(datosProceso);
      actualizarEstado();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [actualizarEstado]);

  // Función para iniciar la simulación
  const iniciarSimulacion = useCallback(() => {
    simuladorRef.current.iniciarSimulacion();
    setEstado(prevEstado => ({
      ...prevEstado,
      estaCapturando: false,
      estaEjecutando: true
    }));
    actualizarEstado();
  }, [actualizarEstado]);

  // Función para finalizar la captura
  const finalizarCaptura = useCallback(() => {
    setEstado(prevEstado => ({
      ...prevEstado,
      estaCapturando: false
    }));
  }, []);

  // Función para ejecutar un paso de la simulación
  const ejecutarPaso = useCallback(() => {
    const simulador = simuladorRef.current;
    simulador.ejecutarPaso();
    
    // Si no hay proceso actual, detener la ejecución
    if (!simulador.procesoActual) {
      setEstado(prevEstado => ({
        ...prevEstado,
        estaEjecutando: false
      }));
    }
    
    actualizarEstado();
  }, [actualizarEstado]);

  // Función para detener la ejecución
  const detenerEjecucion = useCallback(() => {
    setEstado(prevEstado => ({
      ...prevEstado,
      estaEjecutando: false
    }));
  }, []);

  // Función para verificar si un ID está disponible
  const esIdDisponible = useCallback((id) => {
    return simuladorRef.current.esIdDisponible(id);
  }, []);

  // Estadísticas calculadas
  const estadisticas = {
    procesosAgregados: simuladorRef.current.lotes.reduce((sum, l) => sum + l.procesos.length, 0),
    lotesLlenos: simuladorRef.current.lotes.filter((l) => l.procesos.length === 4).length,
    totalLotes: simuladorRef.current.lotes.length
  };

  return {
    // Estado
    estado,
    estadisticas,
    
    // Acciones
    agregarProceso,
    iniciarSimulacion,
    finalizarCaptura,
    ejecutarPaso,
    detenerEjecucion,
    esIdDisponible
  };
};
