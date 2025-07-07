import { useRef, useState } from "react";

export default function Picture({
  readablePicture,
  setReadablePicture,
  setPicture,
}) {
  const [error, setError] = useState("");
  const inputRef = useRef();

  const hanldePicture = (e) => {
    const pic = e.target.files[0];

    if (
      pic?.type !== "image/jpeg" &&
      pic?.type !== "image/png" &&
      pic?.type !== "image/webp"
    ) {
      setError(`${pic?.name} format is not supported.`);
      return;
    } else if (pic?.size > 1024 * 1024 * 5) {
      setError(`${pic?.name} is too large, maximum 5MB allowed.`);
      return;
    }

    setError("");
    setPicture(pic);

    const reader = new FileReader();
    reader.readAsDataURL(pic);
    reader.onload = (e) => {
      setReadablePicture(e.target.result);
    };
  };

  const handleChangePic = () => {
    setPicture("");
    setReadablePicture("");
  };

  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      <label htmlFor="picture" className="text-sm font-bold tracking-wide">
        Foto (Opcional)
      </label>

      {readablePicture ? (
        <div>
          <img
            src={readablePicture}
            alt="picture"
            className="w-20 h-20 object-cover rounded-full"
          />
          <div
            className="mt-2 w-20 py-1 dark:bg-dark_bg_3 rounded-md text-xs font-bold flex items-center justify-center cursor-pointer"
            onClick={handleChangePic}
          >
            Remover
          </div>
        </div>
      ) : (
        <div
          className="w-full h-12 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          Upload de Foto
        </div>
      )}

      <input
        type="file"
        name="picture"
        id="picture"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={hanldePicture}
      />

      {error && (
        <div className="mt-2">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
