import React from 'react';

const FilaProceso = ({ proceso, esActual }) => {
  const loteId = proceso.loteId || 'N/A';
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
    </React.Fragment>
  );
};


export default FilaProceso;
