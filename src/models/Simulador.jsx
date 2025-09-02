import { Proceso } from './Proceso';
import { Lote } from './Lote';

export class Simulador {

  constructor() {
    this.lotes = [];
    this.historialLotes = {};
    this.loteActual = null;
    this.procesoActual = null;
    this.lotesTerminados = []; // Array de lotes completados
    this.contadorGlobal = 0;
    this.estaCapturando = true;
    this.proximoId = 1;
    this.idsUsados = new Set();
    this.lotesProcesados = 0;
  }

  agregarProceso(datosProceso) {
    const idAsignado = (typeof datosProceso.id === 'number' || typeof datosProceso.id === 'string')
      ? Number(datosProceso.id)
      : this.proximoId++;

    if (this.idsUsados.has(idAsignado)) {
      throw new Error('ID de programa duplicado');
    }

    const proceso = new Proceso(
      idAsignado,
      datosProceso.nombreProgramador,
      datosProceso.operacion,
      datosProceso.operando1,
      datosProceso.operando2,
      datosProceso.tme
    );

    this.idsUsados.add(idAsignado);
    
    if (this.lotes.length === 0) {
      const nuevoLote = new Lote(1);
      nuevoLote.agregarProceso(proceso);
      this.lotes.push(nuevoLote);
    } else {
      const ultimoLote = this.lotes[this.lotes.length - 1];
      if (!ultimoLote.agregarProceso(proceso)) {
        const nuevoLote = new Lote(ultimoLote.obtenerLoteId() + 1);
        nuevoLote.agregarProceso(proceso);
        this.lotes.push(nuevoLote);
      }
    }
  }

  esIdDisponible(id) {
    const normalized = Number(id);
    return !this.idsUsados.has(normalized);
  }

  iniciarSimulacion() {
    this.estaCapturando = false;
    if (this.lotes.length > 0) {
      this.loteActual = this.lotes.shift();
      this.procesoActual = this.loteActual.obtenerSiguienteProceso();
    }
  }

  ejecutarPaso() {
    if (!this.procesoActual) return;
    
    this.contadorGlobal++;
    const terminado = this.procesoActual.ejecutar();
    
    if (terminado) {
      // Agregar a procesos terminados del lote actual
      this.historialLotes[this.loteActual.obtenerLoteId()] = this.loteActual.obtenerProcesosTerminados();

      this.loteActual.agregarProcesoTerminado(this.procesoActual);
      this.obtenerSiguienteProceso();
    }
  }

  obtenerSiguienteProceso() {
    if (this.loteActual && this.loteActual.tieneProcesos()) {
      this.procesoActual = this.loteActual.obtenerSiguienteProceso();
    } else if (this.lotes.length > 0) {
      // Lote actual terminado
      this.lotesTerminados.push(this.loteActual);
      this.lotesProcesados += 1;
      this.loteActual = this.lotes.shift();
      this.procesoActual = this.loteActual.obtenerSiguienteProceso();
    } else {
      // Último lote terminado
      if (this.loteActual) {
        this.lotesTerminados.push(this.loteActual);
        this.lotesProcesados += 1;
      }
      this.procesoActual = null;
      this.loteActual = null;
    }
  }

  getLotesPendientes() {
    return this.lotes.length;
  }

  getLotesTerminados() {
    return this.lotesTerminados;
  }

  /**
   * Devuelve el historial de lotes como un array de objetos:
   * [{ loteId: <id>, procesosTerminados: [...] }, ...]
   */
  getHistorialLotesArray() {
    return Object.entries(this.historialLotes).map(([loteId, procesosTerminados]) => {
      const lote = new Lote(loteId);
      lote.procesos_terminados = procesosTerminados;
      return lote;
    });
  }

  getEstadoSimulacion() {
    return {
      loteActual: this.loteActual,
      procesoActual: this.procesoActual,
      lotesTerminados: this.lotesTerminados,
      lotesPendientes: this.lotes.length,
      contadorGlobal: this.contadorGlobal,
      lotesProcesados: this.lotesProcesados
    };
  }
}