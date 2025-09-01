import React, { useState, useEffect } from 'react';
import { Simulador } from '../models/Simulador';
import FormularioCaptura from './FormularioCaptura';
import FilaProceso from './FilaProceso';
import ListaProcesosTerminados from './ListaProcesosTerminados';

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

  // Obtener estado_simulacion estructurado del simulador
  const estado_simulacion = simulador.getEstadoSimulacion();
  
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
            <div><strong>No. lotes pendientes:</strong> {estado_simulacion.lotesPendientes}</div>
            <div><strong>Contador tiempo global:</strong> {estado_simulacion.contadorGlobal}s</div>
          </div>
          <hr />
          
        {/*  */}

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
            {!estado_simulacion.loteActual ? (
              <>
                <div style={{ padding: '4px 0' }}>No lote trabajando</div>
                <div style={{ padding: '4px 0' }}>-</div>
                <div style={{ padding: '4px 0' }}>-</div>
                <div style={{ padding: '4px 0' }}>-</div>
              </>
            ) : (
              <FilaProceso 
                key={estado_simulacion.procesoActual.id}
                proceso={estado_simulacion.procesoActual}
                esActual={true}
              />
                
              )}
            {/* Lista de procesos terminados */}
            <div>
              {estado_simulacion.loteActual && 
               estado_simulacion.loteActual.obtenerProcesosTerminados() && 
               estado_simulacion.loteActual.obtenerProcesosTerminados().length > 0 ? (
                <ListaProcesosTerminados 
                  procesos={estado_simulacion.loteActual.obtenerProcesosTerminados()}
                  lotesTerminados={ simulador.getLotesTerminados()}
                />
              ) : (
                <div style={{ padding: '4px 0' }}>-</div>
              )}
            </div>
              
          </div>
          

        </div>
      )}
    </div>
  );
};

export default ProcesamientoLotes;