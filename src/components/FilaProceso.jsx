import React, { useState } from 'react';

const FilaProceso = ({ proceso, esActual, lotesTerminados }) => {
  const loteId = proceso.loteId || 'N/A';
  const [tick, setTick] = useState(0);
  
  return (
    <React.Fragment>
      <div style={{ padding: '4px 0' }}>
        Lote {loteId} ({proceso.tme}s)
      </div>
      <div style={{ padding: '4px 0' }}>
        <div>Nombre: {proceso.nombreProgramador}</div>
        <div>ID: {proceso.id}</div>
        <div>Proceso: {proceso.operando1}{proceso.operacion}{proceso.operando2}</div>
      </div>
      <div style={{ padding: '4px 0' }}>
        {proceso.tiempoTranscurrido}s
      </div>
      <div style={{ padding: '4px 0' }}>
        {Math.max(0, proceso.tme - proceso.tiempoTranscurrido)}s
      </div>
      <div style={{ padding: '4px 0' }}>
        {esActual && lotesTerminados.length > 0 && (
          <ProcesosTerminados lotesTerminados={lotesTerminados} />
        )}
      </div>
    </React.Fragment>
  );
};

const ProcesosTerminados = ({ lotesTerminados }) => {
  // Obtener todos los procesos terminados de todos los lotes
  const todosTerminados = lotesTerminados.flatMap(lote => 
    lote.obtenerProcesosTerminados()
  );

  if (todosTerminados.length === 0) {
    return '-';
  }

  return (
    <div>
      {todosTerminados.slice(-3).map((p) => (
        <div key={p.id}>
          {p.id} — {p.operando1}{p.operacion}{p.operando2} = {p.resultado}
        </div>
      ))}
    </div>
  );
};

export default FilaProceso;
