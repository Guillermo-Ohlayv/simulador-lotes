import React, { useEffect } from 'react';
import { useSimulador } from '../hooks/useSimulador';
import FormularioCaptura from './FormularioCaptura';
import FilaProceso from './FilaProceso';
import ListaProcesosTerminados from './ListaProcesosTerminados';

const ProcesamientoLotes = () => {
  const {
    estado,
    estadisticas,
    agregarProceso,
    iniciarSimulacion,
    finalizarCaptura,
    ejecutarPaso,
    esIdDisponible
  } = useSimulador();

  useEffect(() => {
    let intervalo;
    if (estado.estaEjecutando && !estado.estaCapturando) {
      intervalo = setInterval(() => {
        ejecutarPaso();
      }, 1000);
    }

    return () => clearInterval(intervalo);
  }, [estado.estaEjecutando, estado.estaCapturando, ejecutarPaso]);

  // Las funciones ya están disponibles desde el hook

  return (
    <div>
      {estado.estaCapturando ? (
        <div>
          <FormularioCaptura
            onAgregarProceso={agregarProceso}
            onFinalizar={finalizarCaptura}
            esIdDisponible={esIdDisponible}
            procesosAgregados={estadisticas.procesosAgregados}
            lotesLlenos={estadisticas.lotesLlenos}
          />
          <div>
            <button onClick={iniciarSimulacion} disabled={estadisticas.totalLotes === 0}>
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
            {!estado.loteActual ? (
              <>
                <div style={{ padding: '4px 0' }}>No lote trabajando</div>
                <div style={{ padding: '4px 0' }}>-</div>
                <div style={{ padding: '4px 0' }}>-</div>
                <div style={{ padding: '4px 0' }}>-</div>
              </>
            ) : (
              <FilaProceso 
                key={estado.procesoActual.id}
                proceso={estado.procesoActual}
                esActual={true}
              />
                
              )}
            {/* Lista de procesos terminados */}
            <ListaProcesosTerminados 
              lotesTerminados={estado.historialLotes}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ProcesamientoLotes;