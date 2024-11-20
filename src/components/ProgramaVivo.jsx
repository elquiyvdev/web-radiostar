import { useState, useEffect } from "react";
import { PlayButton } from "../icons/PlayIcon.jsx";
// Programa predeterminado
const programaPredeterminado = {
  nombre: "Música Star",
  descripcion: "Escucha música todo el día",
  imagen: "LogoMusicStar.png",
};

function horaAMinutos(hora) {
  const [hh, mm] = hora.split(":").map((x) => parseInt(x, 10));
  return hh * 60 + mm;
}

function minutosAHora(minutos) {
  const hh = Math.floor(minutos / 60);
  const mm = minutos % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function horariosSolapados(horaInicioNuevo, horaFinNuevo, horariosExistentes) {
  return horariosExistentes.some((programa) => {
    const horaInicioExistente = horaAMinutos(programa.hora_inicio);
    const horaFinExistente = horaAMinutos(programa.hora_fin);

    // Verifica si el nuevo horario se solapa con cualquier horario existente
    return (
      (horaInicioNuevo < horaFinExistente && horaFinNuevo > horaInicioExistente)
    );
  });
}

function LiveProgram() {
  const [horarios, setHorarios] = useState([]);
  const [programaEnVivo, setProgramaEnVivo] = useState(null);
  const [proximosProgramas, setProximosProgramas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHorarios() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/horarios");
        const data = await response.json();

        const programasOrdenados = data.data
          .map((programa) => ({
            ...programa,
            dias: JSON.parse(programa.dias), // Parsear 'dias' de JSON string a array
          }))
          .sort((a, b) => horaAMinutos(a.hora_inicio) - horaAMinutos(b.hora_inicio));

        const horariosCompletos = [];
        let inicioDia = 0;

        programasOrdenados.forEach((programa) => {
          const horaInicioNuevo = horaAMinutos(programa.hora_inicio);
          const horaFinNuevo = horaAMinutos(programa.hora_fin);

          // Verifica si el nuevo programa se solapa con cualquier horario existente
          if (!horariosSolapados(horaInicioNuevo, horaFinNuevo, horariosCompletos)) {
            // Solo agrega el programa si no hay solapamiento
            if (horaInicioNuevo > inicioDia) {
              
            }

            horariosCompletos.push(programa);
            inicioDia = horaFinNuevo;
          } else {
            console.log(
              `El programa "${programa.programa.nombre}" con horario ${programa.hora_inicio} - ${programa.hora_fin} no se agrega porque se solapa con otro programa.`
            );
          }
        });


        setHorarios(horariosCompletos);
        console.log("Horarios finales:", horariosCompletos);
      } catch (error) {
        console.error("Error al obtener los horarios:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHorarios();
  }, []);
  
  useEffect(() => {
    function obtenerProgramaEnVivo() {
      const ahora = new Date();
      const diaActual = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][
        ahora.getDay()
      ];
      const horaActual = minutosAHora(ahora.getHours() * 60 + ahora.getMinutes());
  
      for (let i = 0; i < horarios.length; i++) {
        const horario = horarios[i];
        if (
          horario.dias.includes(diaActual) && // Verificar si aplica para hoy
          horaAMinutos(horario.hora_inicio) <= horaAMinutos(horaActual) &&
          horaAMinutos(horario.hora_fin) > horaAMinutos(horaActual)
        ) {
          setProgramaEnVivo(horario);
          setProximosProgramas(obtenerSiguientesProgramas(i));
          break;
        }
      }
    }
  
    function obtenerSiguientesProgramas(indiceActual) {
      const siguientes = [];
      for (let i = 1; i <= 3; i++) {
        const indice = (indiceActual + i) % horarios.length;
        siguientes.push(horarios[indice]);
      }
      return siguientes;
    }
  
    const intervalo = setInterval(obtenerProgramaEnVivo, 60000);
    obtenerProgramaEnVivo();
    return () => clearInterval(intervalo);
  }, [horarios]);

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 m-2 sm:m-10 p-3 sm:p-6 w-auto bg-gradient-to-r from-red-700 to-black shadow-md shadow-white rounded-xl text-white">
      {programaEnVivo ? (
        <div className="flex gap-1">
          {/* Contenido si programaEnVivo es true */}
          <img
            src={`/source/images/${programaEnVivo.programa.imagen}`}
            alt={programaEnVivo.programa.nombre}
            className="h-auto max-w-32 sm:max-w-60"
          />
          <div className="flex flex-col gap-1">
            <h4>En vivo</h4>
            <h2 className="font-extrabold text-3xl">{programaEnVivo.programa.nombre}</h2>
            <p>
              {programaEnVivo.hora_inicio} a {programaEnVivo.hora_fin}
            </p>
            <PlayButton id={programaEnVivo.programa.id} />
          </div>
        </div>
        ) : (
          <div className="flex gap-1">
          {/* Contenido si programaEnVivo es true */}
          <img
            src={`/source/images/default.png`}
            alt="Default"
            className="h-auto max-w-32 sm:max-w-60"
          />
          <div className="flex flex-col gap-1">
            <h4>Buscando ....</h4>
            <h2 className="font-extrabold text-3xl">Cargando Programa ...</h2>
            <p>
              Espere un momento ....
            </p>
          </div>
        </div>
        )}

      {proximosProgramas.length > 0 && (
        <div className="sm:border-l-4 sm:border-l-white sm:px-10 gap-2">
          <h4>Siguientes Programas</h4>
          {proximosProgramas.map((programa, index) => (
            <div className="flex gap-2 my-2" key={index}>
             <img
                  src={`/source/images/${programa.programa.imagen}`}
                  alt={programa.programa.nombre}
                  className="h-auto max-w-20"
                />
              <div>
                <h2 className="font-extrabold text-xl">{programa.programa.nombre}</h2>
                <p>
                  {programa.hora_inicio} - {programa.hora_fin}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveProgram;
