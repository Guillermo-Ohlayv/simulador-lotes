import React, { useState, useEffect } from 'react';
import { Simulador } from '../models/Simulador';
import FormularioCaptura from './FormularioCaptura';
import FilaProceso from './FilaProceso';
import ResumenLotes from './ResumenLotes';

const ProcesamientoLotes = () => {
  const [simulador] = useState(new Simulador());
  const [estaCapturando, setEstaCapturando] = useState(true);
  const [tick, setTick] = useState(0);
  const [estaEjecutando, setEstaEjecutando] = useState(false);

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

  const agregarProceso = (datosProceso) => {
    simulador.agregarProceso(datosProceso);
    setTick(prev => prev + 1);
  };

  const iniciarSimulacion = () => {
    setEstaCapturando(false);
    simulador.iniciarSimulacion();
    setEstaEjecutando(true);
    setTick(prev => prev + 1);
  };

  const finalizarCaptura = () => {
    setEstaCapturando(false);
  };

  // Obtener estado estructurado del simulador
  const estado = simulador.getEstadoSimulacion();
  
  // Calcular estadísticas para el formulario
  const procesosAgregados = simulador.lotes.reduce((sum, l) => sum + l.procesos.length, 0);
  const lotesLlenos = simulador.lotes.filter((l) => l.procesos.length === 4).length;

  return (
    <div>
      {estaCapturando ? (
        <div>
          <FormularioCaptura
            onAgregarProceso={agregarProceso}
            onFinalizar={finalizarCaptura}
            esIdDisponible={(id) => simulador.esIdDisponible(id)}
            procesosAgregados={procesosAgregados}
            lotesLlenos={lotesLlenos}
          />
          <div>
            <button onClick={iniciarSimulacion} disabled={simulador.lotes.length === 0}>
              Iniciar Simulación
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div><strong>No. lotes pendientes:</strong> {estado.lotesPendientes}</div>
            <div><strong>Contador tiempo global:</strong> {estado.contadorGlobal}s</div>
          </div>
          <hr />
          
          {/* Tabla principal */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', 
            gap: 8,
            border: '1px solid #ccc',
            padding: 8
          }}>
            {/* Encabezados */}
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', padding: '4px 0' }}>
              Lote Trabajando
            </div>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', padding: '4px 0' }}>
              Proceso en ejecución
            </div>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', padding: '4px 0' }}>
              Tiempo transcurrido
            </div>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', padding: '4px 0' }}>
              Tiempo restante
            </div>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', padding: '4px 0' }}>
              Procesos Terminados
            </div>

            {/* Contenido de la tabla */}
            {!estado.loteActual ? (
              <>
                <div style={{ padding: '4px 0' }}>No lote trabajando</div>
                <div style={{ padding: '4px 0' }}>-</div>
                <div style={{ padding: '4px 0' }}>-</div>
                <div style={{ padding: '4px 0' }}>-</div>
                <div style={{ padding: '4px 0' }}>-</div>
              </>
            ) : (
              // Mostrar todos los procesos del lote actual (completos + pendientes)
              estado.loteActual.obtenerProcesosCompletos().map((proceso) => (
                <FilaProceso 
                  key={proceso.id}
                  proceso={proceso}
                  esActual={proceso === estado.procesoActual}
                  lotesTerminados={estado.lotesTerminados}
                />
              ))
            )}
          </div>

          {/* Resumen de lotes terminados */}
          {/* <ResumenLotes lotesTerminados={estado.lotesTerminados} /> */}
        </div>
      )}
    </div>
  );
};

export default ProcesamientoLotes;