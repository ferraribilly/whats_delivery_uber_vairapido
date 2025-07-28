import { capitalize } from "../../../utils/string";
import CallTimes from "./CallTimes";

export default function CallArea({
  name,
  totalSecInCall,
  setTotalSecInCall,
  callAccepted,
  isUserOnline, // ✅ novo prop
}) {
  return (
    <div className="absolute top-12 z-40 w-full p-1 z-[999]">
      {/*Container*/}
      <div className="flex flex-col items-center">
        {/*Call infos*/}
        <div className="flex flex-col items-center gap-y-1">
          <h1 className="text-white text-lg">
            <b>{name ? capitalize(name) : ""}</b>
          </h1>

          {/* Mostra status da call */}
          {totalSecInCall === 0 ? (
            <span className="text-dark_text_1">Ringing...</span>
          ) : null}

          {/* Mostra aviso se o usuário estiver offline */}
          {isUserOnline === false && (
            <span className="text-red-500 text-sm mt-2">
              📡 Usuário está offline. Chamada não será completada.
            </span>
          )}

          <CallTimes
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
            callAccepted={callAccepted}
          />
        </div>
      </div>
    </div>
  );
}
