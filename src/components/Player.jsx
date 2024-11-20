import { useState, useRef, useEffect } from "react";
import { usePlayerStore } from "../store/playerStore";

export const Pause = ({ size }) => (
  <svg
    role="img"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export const Play = ({ size }) => (
  <svg
    role="img"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
    />
  </svg>
);

const Tv = () => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="size-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
    />
  </svg>
);

export function Player() {
    const { currentProgram, isPlaying, setIsPlaying, isShow } = usePlayerStore((state) => state);
    const [programInfo, setProgramInfo] = useState(null);
    const audioRef = useRef();

    useEffect(() => {
        const fetchProgramInfo = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/programas");
            const data = await response.json();
            const program = data.data.find((p) => p.id === currentProgram);
            setProgramInfo(program || null);
        };

        if (currentProgram) fetchProgramInfo();
    }, [currentProgram]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.src = "https://panel.innovatestream.pe:10873/stream";
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    }, [isPlaying]);

    const handleClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <footer className={`${isShow ? "fixed" : "hidden"} bottom-0 left-0 min-h-[100px] w-full bg-black rounded-lg text-white z-40`}>
            <div className="flex flex-row justify-between w-full p-3 px-10 z-20">
                <div className="flex gap-3">
                    <img
                        src={`/source/images/${programInfo?.imagen || "default.png"}`}
                        className="h-auto max-w-24"
                        alt={programInfo?.nombre || "Programa"}
                    />
                    <div className="flex flex-col gap-1">
                        <h4>En vivo</h4>
                        <h2 className="font-extrabold text-3xl ">
                            {programInfo?.nombre || "Cargando..."}
                        </h2>
                        <p>
                            {programInfo?.horarios[0]?.hora_inicio} -{" "}
                            {programInfo?.horarios[0]?.hora_fin}
                        </p>
                    </div>
                </div>
                <div className="grid place-content-center gap-4 flex-1">
                    <div className="flex justify-center">
                        <button className="h-auto max-w-lg" onClick={handleClick}>
                            {isPlaying ? <Pause size={60} /> : <Play size={60} />}
                        </button>
                    </div>
                </div>
                <div className="place-content-center flex items-center gap-2 text-2xl font-bold ">
                    <Tv /> STREAM
                </div>
                <audio ref={audioRef} />
            </div>
        </footer>
    );
}

