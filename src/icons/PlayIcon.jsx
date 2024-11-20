import { Pause, Play} from "../components/Player"
import { usePlayerStore } from "../store/playerStore"

export function PlayButton({ id }) {
    const { isPlaying, setIsPlaying, setCurrentProgram, setIsShow, isShow} = usePlayerStore((state) => state);

    const handleClick = () => {
        setIsShow(true);
        setIsPlaying(!isPlaying); // Controla la reproducción
        setCurrentProgram(id); // Establece el programa actual
    };

    return (
        <button
            onClick={handleClick}
            className="sm:mt-4 flex items-center justify-center sm:gap-3 bg-yellow-500 transition-all duration-500 hover:bg-yellow-800 py-1 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl"
        >
            {isPlaying ? <Pause size={40} /> : <Play size={40} />}
            Escuchar en vivo
        </button>
    );
}