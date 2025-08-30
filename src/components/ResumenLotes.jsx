import React from 'react';

const ResumenLotes = ({ lotesTerminados }) => {
  if (lotesTerminados.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* <h3>Procesos Terminados por Lote:</h3> */}
      {lotesTerminados.map((lote, index) => (
        <div key={lote.id} style={{ marginBottom: 8 }}>
          <strong>Lote {lote.id}:</strong>
          {lote.obtenerProcesosTerminados().map((p) => (
            <div key={p.id} style={{ marginLeft: 16 }}>
              {p.id} — {p.operando1}{p.operacion}{p.operando2} = {p.resultado}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ResumenLotes;
