import { useRef, useState } from "react";

export default function Picture({
  setReadableRg,
  readableRg,
  setRg,
  readableRgBack,
  setReadableRgBack,
  setRgBack,
}) {
  const [error, setError] = useState("");

  const inputRgRef = useRef();
  const inputRgBackRef = useRef();

  const handlePicture = (e, setImage, setReadable) => {
    const pic = e.target.files[0];
    if (!pic) return;

    if (
      pic.type !== "image/jpeg" &&
      pic.type !== "image/png" &&
      pic.type !== "image/webp"
    ) {
      setError(`${pic.name} formato não suportado. Apenas PNG, JPEG ou WEBP.`);
      return;
    }

    if (pic.size > 1024 * 1024 * 5) {
      setError(`${pic.name} é muito grande. Máximo permitido: 5MB.`);
      return;
    }

    setError("");
    setImage(pic);
    const reader = new FileReader();
    reader.onload = (e) => setReadable(e.target.result);
    reader.readAsDataURL(pic);
  };

  const handleRemove = (setImage, setReadable) => {
    setImage("");
    setReadable("");
  };

  const renderImageField = ({
    label,
    readableImage,
    setFile,
    setReadable,
    refInput,
    onClickLabel,
    imageClass = "w-32 h-20",
  }) => (
    <div className="space-y-1">
      <label className="text-sm font-bold tracking-wide">{label}</label>
      {readableImage ? (
        <div>
          <img
            src={readableImage}
            alt={label}
            className={`${imageClass} object-cover rounded-md`}
          />
          <div
            className="mt-2 w-24 py-1 bg-gray-200 dark:bg-dark_bg_3 rounded-md text-xs font-bold flex items-center justify-center cursor-pointer"
            onClick={() => handleRemove(setFile, setReadable)}
          >
            Remover
          </div>
        </div>
      ) : (
        <div
          className="w-full h-12 bg-gray-100 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer"
          onClick={onClickLabel}
        >
          Upload {label}
        </div>
      )}
      <input
        type="file"
        hidden
        ref={refInput}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handlePicture(e, setFile, setReadable)}
      />
    </div>
  );

  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-6">
      {/* RG Frente */}
      {renderImageField({
        label: "RG - Frente",
        readableImage: readableRg,
        setFile: setRg,
        setReadable: setReadableRg,
        refInput: inputRgRef,
        onClickLabel: () => inputRgRef.current.click(),
      })}

      {/* RG Verso */}
      {renderImageField({
        label: "RG - Verso",
        readableImage: readableRgBack,
        setFile: setRgBack,
        setReadable: setReadableRgBack,
        refInput: inputRgBackRef,
        onClickLabel: () => inputRgBackRef.current.click(),
      })}

      {/* Erro */}
      {error && (
        <div className="mt-2">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
