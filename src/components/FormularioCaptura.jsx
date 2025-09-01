import React, { useState } from "react";

const FormularioCaptura = ({ onAgregarProceso, onFinalizar, esIdDisponible, procesosAgregados = 0, lotesLlenos = 0 }) => {
    const [nombreProgramador, setNombreProgramador] = useState("");
    const [operacion, setOperacion] = useState("+");
    const [operando1, setOperando1] = useState("");
    const [operando2, setOperando2] = useState("");
    const [tme, setTme] = useState("");
    const [id, setId] = useState("");
    const [error, setError] = useState("");




    const [cantidadAuto, setCantidadAuto] = useState(5);

    const validar = () => {
        setError("");
        if (!nombreProgramador.trim()) {
            setError("Nombre de programador requerido");
            return false;
        }
        if (id === "" || isNaN(Number(id))) {
            setError("Número de Programa inválido");
            return false;
        }
        if (typeof esIdDisponible === "function" && !esIdDisponible(id)) {
            setError("Número de Programa ya existe");
            return false;
        }
        const op1 = Number(operando1);
        const op2 = Number(operando2);
        if (isNaN(op1) || isNaN(op2)) {
            setError("Operandos inválidos");
            return false;
        }
        const tmeNum = Number(tme);
        if (isNaN(tmeNum) || tmeNum <= 0) {
            setError("TME debe ser > 0");
            return false;
        }
        if ((operacion === "/" || operacion === "%") && op2 === 0) {
            setError("No se permite división/residuo entre 0");
            return false;
        }
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validar()) return;
        debugger;
        onAgregarProceso({
            id: typeof id === "string" ? (id.trim() === "" ? undefined : Number(id)) : id,
            nombreProgramador,
            operacion,
            operando1: Number(operando1),
            operando2: Number(operando2),
            tme: Number(tme)
        });
        setNombreProgramador("");
        setOperando1("");
        setOperando2("");
        setTme("");
        setId("");
    };







    const nombres = [
        "Juan", "María", "Pedro", "Lucía", "Ana", "Miguel", "Sofía", "Luis", "Elena", "Carlos",
        "Laura", "Diego", "Paola", "Ricardo", "Valeria", "Andrés", "Fernanda", "Jorge", "Diana", "Emilio"
    ];

    const operaciones = ["+", "-", "*", "/", "%", "^"];

    const obtenerIdDisponible = () => {
        let candidato = 1;
        while (typeof esIdDisponible === "function" && !esIdDisponible(candidato)) {
            candidato += 1;
        }
        return candidato;
    };

    const generarProcesoAleatorio = () => {
        const op = operaciones[Math.floor(Math.random() * operaciones.length)];
        const op1 = Math.floor(Math.random() * 20) + 1; // 1..20
        let op2 = Math.floor(Math.random() * 20);
        if ((op === "/" || op === "%") && op2 === 0) {
            op2 = 1; // evitar división/residuo entre 0
        }
        const tiempo = Math.floor(Math.random() * 9) + 1; // 1..9
        return {
            id: obtenerIdDisponible(),
            nombreProgramador: nombres[Math.floor(Math.random() * nombres.length)],
            operacion: op,
            operando1: op1,
            operando2: op2,
            tme: tiempo
        };
    };

    const autoGenerar = () => {
        setError("");
        const n = Number(cantidadAuto);
        if (isNaN(n) || n <= 0) {
            setError("Cantidad a generar inválida");
            return;
        }
        for (let i = 0; i < n; i += 1) {
            const datos = generarProcesoAleatorio();
            onAgregarProceso(datos);
        }
    };






    return (
        <div>
            <h2>Captura de Procesos</h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                <div><strong>Procesos agregados:</strong> {procesosAgregados}</div>
                <div><strong>Lotes llenos:</strong> {lotesLlenos}</div>
            </div>




            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <label>Autogenerar</label>
                <input type="number" min="1" value={cantidadAuto} onChange={(e) => setCantidadAuto(e.target.value)} style={{ width: 80 }} />
                <button type="button" onClick={autoGenerar}>Generar procesos aleatorios</button>
            </div>





            <form onSubmit={onSubmit}>
                <div>
                    <label>Nombre de Programador</label>
                    <input type="text" value={nombreProgramador} onChange={(e) => setNombreProgramador(e.target.value)} required />
                </div>
                <div>
                    <label>Número de Programa (único)</label>
                    <input type="number" value={id} onChange={(e) => setId(e.target.value)} required />
                </div>
                <div>
                    <label>Operación</label>
                    <select value={operacion} onChange={(e) => setOperacion(e.target.value)}>
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">*</option>
                        <option value="/">/</option>
                        <option value="%">%</option>
                        <option value="^">^</option>
                    </select>
                </div>
                <div>
                    <label>Operando 1</label>
                    <input type="number" value={operando1} onChange={(e) => setOperando1(e.target.value)} required />
                </div>
                <div>
                    <label>Operando 2</label>
                    <input type="number" value={operando2} onChange={(e) => setOperando2(e.target.value)} required />
                </div>
                <div>
                    <label>Tiempo Máximo Estimado</label>
                    <input type="number" min="1" value={tme} onChange={(e) => setTme(e.target.value)} required />
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
                <div>
                    <button type="submit">Agregar Proceso</button>
                    <button type="button" onClick={onFinalizar}>Finalizar Captura</button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCaptura;
