import { useRef, useState } from "react";

export default function PictureCnh({
  readablePicture,
  setReadablePicture,
  setPicture,
  readableCnh,
  setReadableCnh,
  setCnh,
  readableCnhBack,
  setReadableCnhBack,
  setCnhBack,
  readableDocVeiculo,
  setReadableDocVeiculo,
  setDocVeiculo,
}) {
  const [error, setError] = useState("");

  const inputRef = useRef();
  const inputCnhRef = useRef();
  const inputCnhBackRef = useRef();
  const inputDocVeiculoRef = useRef();

  const handlePicture = (e, setImage, setReadable) => {
    let pic = e.target.files[0];
    if (
      pic.type !== "image/jpeg" &&
      pic.type !== "image/png" &&
      pic.type !== "image/webp"
    ) {
      setError(`${pic.name} format is not supported.`);
      return;
    } else if (pic.size > 1024 * 1024 * 5) {
      setError(`${pic.name} is too large, maximum 5mb allowed.`);
      return;
    } else {
      setError("");
      setImage(pic);
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      reader.onload = (e) => {
        setReadable(e.target.result);
      };
    }
  };

  const handleRemove = (setImage, setReadable) => {
    setImage("");
    setReadable("");
  };

  const renderImageField = ({
    label,
    readable,
    setFile,
    setReadable,
    refInput,
    onClickLabel,
    imageClass = "w-32 h-20",
  }) => (
    <div className="space-y-1">
      <label className="text-sm font-bold tracking-wide">{label}</label>
      {readable ? (
        <div>
          <img
            src={readable}
            alt={label}
            className={`${imageClass} object-cover rounded-md`}
          />
          <div
            className="mt-2 w-24 py-1 dark:bg-dark_bg_3 rounded-md text-xs font-bold flex items-center justify-center cursor-pointer"
            onClick={() => handleRemove(setFile, setReadable)}
          >
            Remover
          </div>
        </div>
      ) : (
        <div
          className="w-full h-12 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer"
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
      {/* Foto de perfil */}
      {renderImageField({
        label: "Foto perfil (Obrigatório)",
        readable: readablePicture,
        setFile: setPicture,
        setReadable: setReadablePicture,
        refInput: inputRef,
        onClickLabel: () => inputRef.current.click(),
        imageClass: "w-20 h-20 rounded-full",
      })}

      {/* CNH Frente */}
      {renderImageField({
        label: "CNH - Frente",
        readable: readableCnh,
        setFile: setCnh,
        setReadable: setReadableCnh,
        refInput: inputCnhRef,
        onClickLabel: () => inputCnhRef.current.click(),
      })}

      {/* CNH Verso */}
      {renderImageField({
        label: "CNH - Verso",
        readable: readableCnhBack,
        setFile: setCnhBack,
        setReadable: setReadableCnhBack,
        refInput: inputCnhBackRef,
        onClickLabel: () => inputCnhBackRef.current.click(),
      })}


      {/* Documento do veiculo */}
      {renderImageField({
        label: "Documento do Veiculo",
        readable: readableDocVeiculo,
        setFile: setDocVeiculo,
        setReadable: setReadableDocVeiculo,
        refInput: inputDocVeiculoRef,
        onClickLabel: () => inputDocVeiculoRef.current.click(),
      })}

      {/* Erros */}
      <div className="mt-2">
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  );
}
