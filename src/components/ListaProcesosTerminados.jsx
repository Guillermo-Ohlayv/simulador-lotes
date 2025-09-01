import React from 'react';

const ListaProcesosTerminados = ({ procesos, lotesTerminados }) => {
  if ((!procesos || procesos.length === 0) && (!lotesTerminados || lotesTerminados.length === 0)) {
    return <div style={{ padding: '4px 0' }}>No hay procesos terminados</div>;
  }

  return (
    <div>
      {lotesTerminados && lotesTerminados.length > 0 && lotesTerminados.map((lote) => {
        const procesosLote = lote.obtenerProcesosTerminados();
        if (!procesosLote || procesosLote.length === 0) return null;

        return (
          <div 
            key={lote.id}
          >
            <div>
              Lote {lote.id}
            </div>
            {procesosLote.map((proceso) => (
              <div 
                key={proceso.id}>
                <div>ID: {proceso.id}</div>
                <div>{proceso.operando1} {proceso.operacion} {proceso.operando2} = {proceso.resultado}</div>
              </div>
            ))}
          </div>
        );
      })}

      {procesos && procesos.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          {procesos.map((proceso) => (
            <div>
              <div>ID: {proceso.id}</div>
              <div>{proceso.operando1} {proceso.operacion} {proceso.operando2} = {proceso.resultado}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaProcesosTerminados;