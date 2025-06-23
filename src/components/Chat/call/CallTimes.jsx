import { useEffect } from "react";

export default function CallTimes({
  totalSecInCall,
  setTotalSecInCall,
  callAccepted,
}) {
  useEffect(() => {
    let interval;
    if (callAccepted) {
      interval = setInterval(() => {
        setTotalSecInCall((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setTotalSecInCall(0);
    };
  }, [callAccepted]);

  return (
    <div
      className={`text-dark_text_2 ${
        totalSecInCall !== 0 ? "block" : "hidden"
      }`}
    >
      {parseInt(totalSecInCall / 3600) > 0 && (
        <>
          <span>
            {String(parseInt(totalSecInCall / 3600)).padStart(2, "0")}
          </span>
          <span>:</span>
        </>
      )}
      <span>
        {String(parseInt((totalSecInCall / 60) % 60)).padStart(2, "0")}
      </span>
      <span>:</span>
      <span>{String(totalSecInCall % 60).padStart(2, "0")}</span>
    </div>
  );
}
