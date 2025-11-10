import { useEffect, useState } from "react";
import "../components/Divisa.css"; // Aquí pondremos los estilos modernos

export function Divisa() {
  const [monedas, setMonedas] = useState([]);
  const [base, setBase] = useState("USD");
  const [destino, setDestino] = useState("EUR");
  const [cantidad, setCantidad] = useState(1);
  const [resultado, setResultado] = useState(null);
  const [tasas, setTasas] = useState({});
  const [fecha, setFecha] = useState("");
  const [cargando, setCargando] = useState(false);

  // Obtener lista de monedas
  useEffect(() => {
    fetch("https://api.frankfurter.dev/v1/currencies")
      .then((res) => res.json())
      .then((data) => setMonedas(Object.keys(data)))
      .catch((err) => console.error("Error al cargar monedas:", err));
  }, []);

  // Obtener tasas base USD
  useEffect(() => {
    fetch("https://api.frankfurter.dev/v1/latest?base=USD")
      .then((res) => res.json())
      .then((data) => {
        setTasas(data.rates);
        setFecha(data.date);
      })
      .catch((err) => console.error("Error al cargar tasas:", err));
  }, []);

  const convertir = async () => {
    if (!cantidad || cantidad <= 0) {
      alert("Ingresa una cantidad válida");
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${cantidad}&from=${base}&to=${destino}`
      );
      const data = await res.json();
      setResultado(data.rates[destino]);
    } catch (err) {
      console.error("Error en conversión:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="divisa-container">
      <h1 className="titulo">💱 Conversor de Divisas</h1>

      <div className="card conversor-card">
        <div className="input-group">
          <label>Moneda origen:</label>
          <select value={base} onChange={(e) => setBase(e.target.value)}>
            {monedas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Moneda destino:</label>
          <select value={destino} onChange={(e) => setDestino(e.target.value)}>
            {monedas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            min="1"
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>

        <button className="btn-convertir" onClick={convertir} disabled={cargando}>
          {cargando ? "Convirtiendo..." : "Convertir"}
        </button>

        {resultado && (
          <div className="resultado">
            <p>
              {cantidad} {base} ={" "}
              <strong>
                {resultado.toFixed(2)} {destino}
              </strong>
            </p>
          </div>
        )}
      </div>

      <div className="card tasas-card">
        <h2>Tasas actuales (base: USD)</h2>
        <table>
          <thead>
            <tr>
              <th>Moneda</th>
              <th>Tasa</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tasas).map(([moneda, valor]) => (
              <tr key={moneda}>
                <td>{moneda}</td>
                <td>{valor.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="fecha">Última actualización: {fecha}</p>
      </div>
    </div>
  );
}