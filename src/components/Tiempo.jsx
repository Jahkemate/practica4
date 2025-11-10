import { useEffect, useState } from "react";


export function Tiempo() {
  const [datosTiempo, setDatosTiempo] = useState(null);
  const [error, SetError] = useState("");
  const [buscar, datoBuscar] = useState("Olanchito");

  const controladorInput = (e) => {
    if (e.key === "Enter") {
      datoBuscar(e.target.value);
    }
  };

  useEffect(() => {
    const miFuncionTiempo = async () => {
      try {
        const respuesta = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=2ea80588605e4cb9bd1232552252210&q=${buscar}&aqi=no`
        );
        const datosJson = await respuesta.json();
        console.log(datosJson);
        setDatosTiempo(datosJson);
      } catch (err) {
        SetError(err.message);
      }
    };

    miFuncionTiempo();
  }, [buscar]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!datosTiempo) {
    return <p>Cargando datos del clima....</p>;
  }

  // Color de fondo dinámico según la temperatura
  const temp = datosTiempo.current.temp_c;
  let fondo = "#74b9ff"; // azul suave (por defecto)
  if (temp > 30) fondo = "#ff7675"; // rojo cálido
  else if (temp > 20) fondo = "#ffeaa7"; // amarillo cálido
  else if (temp < 15) fondo = "#81ecec"; // celeste frío

  return (
    <div
      className="card mx-auto shadow-lg text-center"
      style={{
        width: "320px",
        backgroundColor: fondo,
        borderRadius: "20px",
        padding: "15px",
        color: "#2d3436",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={`https:${datosTiempo.current.condition.icon}`}
          className="card-img-top"
          alt={datosTiempo.current.condition.text}
          style={{
            width: "90px",
            marginBottom: "10px",
            filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.2))",
          }}
        />
      </div>

      <div className="card-body">
        <h5 className="card-title">
          Temperatura: {datosTiempo.current.temp_c} °C
        </h5>
        <p className="card-text">Lugar: {datosTiempo.location.name}</p>
        <p className="card-text">
          Descripción: {datosTiempo.current.condition.text}
        </p>
      </div>

      <input
        style={{
          width: "90%",
          marginTop: "10px",
          textAlign: "center",
          border: "none",
          borderRadius: "10px",
          padding: "8px",
          outline: "none",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        }}
        type="text"
        placeholder="Presiona Enter para buscar"
        className="card-text mx-auto"
        onKeyUp={(e) => controladorInput(e)}
      />
    </div>
  );
}