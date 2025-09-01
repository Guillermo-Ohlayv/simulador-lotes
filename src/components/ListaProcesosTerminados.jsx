import React from 'react';

const ListaProcesosTerminados = ({ procesos }) => {
  if (!procesos || procesos.length === 0) {
    return <div style={{ padding: '4px 0' }}>No hay procesos terminados</div>;
  }

  return (
    <div style={{ padding: '4px 0' }}>
      {procesos.map((proceso) => (
        <div 
          key={proceso.id} 
          style={{ 
            marginBottom: '8px',
            padding: '4px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}
        >
          <div>ID: {proceso.id}</div>
          <div>{proceso.operando1} {proceso.operacion} {proceso.operando2} = {proceso.resultado}</div>
        </div>
      ))}
    </div>
  );
};

export default ListaProcesosTerminados;
