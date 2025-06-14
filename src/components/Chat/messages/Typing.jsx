import { useEffect, useRef } from "react";
import moment from "moment";
import { BeatLoader } from "react-spinners";
import TraingleIcon from "../../../svg/triangle";

export default function Typing({ message }) {
  const audioRef = useRef(null);

  useEffect(() => {
    // Toca o áudio ao montar
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Erro ao tocar som de digitação:", err);
      });
    }

    return () => {
      // Pausa o áudio ao desmontar
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className={`w-full flex mt-2 space-x-3 max-w-xs`}>
      {/*Message Container*/}
      <div>
        <div
          className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg dark:bg-dark_bg_2`}
        >
          {/*Typing animation*/}
          <BeatLoader color="#fff" size={10} />
          {/*Traingle*/}
          <span>
            <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
          </span>
        </div>
      </div>

      {/* Elemento de áudio */}
      <audio ref={audioRef} src="/audio/typing.mp3" loop />
    </div>
  );
}
