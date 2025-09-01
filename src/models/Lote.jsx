export class Lote {
  constructor(id) {
    this.procesos = [];
    this.id = id;
    this.procesos_terminados = [];
  }

  agregarProceso(proceso) {
    if (this.procesos.length < 4) {
      proceso.loteId = this.id; // Agregar referencia al lote
      this.procesos.push(proceso);
      return true;
    }
    return false;
  }

  tieneProcesos() {
    return this.procesos.length > 0;
  }

  obtenerSiguienteProceso() {
    return this.procesos.shift();
  }

  // Crear un metodo para regresar el primero proceso sin eliminarlo
  obtenerPrimerProceso() {
    return this.procesos[0];
  }

  obtenerLoteId() {
    return this.id;
  }

  obtenerProcesosTerminados() {
    return this.procesos_terminados;
  }

  obtenerProcesos() {
    return this.procesos;
  }

  obtenerProcesosCompletos() {
    debugger;
    return [...this.procesos_terminados, ...this.procesos];
  }

  estaCompleto() {
    return this.procesos.length === 0 && this.procesos_terminados.length > 0;
  }

  agregarProcesoTerminado(proceso) {
    this.procesos_terminados.push(proceso);
  }
}