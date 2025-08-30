export class Proceso {
  constructor(id, nombreProgramador, operacion, operando1, operando2, tme) {
    this.id = id;
    this.nombreProgramador = nombreProgramador;
    this.operacion = operacion;
    this.operando1 = operando1;
    this.operando2 = operando2;
    this.tme = tme;   //tiempo maximo estimado, tiene que ser siempre mayor a 0 y se tomara como segundos
    this.tiempoTranscurrido = 0;
    this.resultado = null;
  }

  ejecutar() {
    this.tiempoTranscurrido++;
    
    if (this.tiempoTranscurrido >= this.tme) {
      this.calcularResultado();
      return true;
    }
    return false;
  }

  calcularResultado() {
    switch(this.operacion) {
      case '+': this.resultado = this.operando1 + this.operando2; break;
      case '-': this.resultado = this.operando1 - this.operando2; break;
      case '*': this.resultado = this.operando1 * this.operando2; break;
      case '/': this.resultado = this.operando2 !== 0 ? this.operando1 / this.operando2 : 'Error: División por cero'; break;
      case '%': this.resultado = this.operando2 !== 0 ? this.operando1 % this.operando2 : 'Error: División por cero'; break;
      case '^': this.resultado = Math.pow(this.operando1, this.operando2); break;
      default: this.resultado = 'Operación no válida';
    }
  }
}