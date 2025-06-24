import { useRef } from "react";
import { CloseIcon } from "../../../../svg";
import { useDispatch } from "react-redux";
import { addFiles } from "../../../../features/chatSlice";
import { getFileType } from "../../../../utils/file";

export default function Add() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const filestHandler = (e) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.rar",
      "application/zip",
      "application/x-zip-compressed",
      "audio/mpeg",
      "audio/wav",
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/webm",
      "video/mp4",
      "video/mpeg",
    ];

    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type) || file.size > 1024 * 1024 * 10) {
        return;
      }

      const type = getFileType(file.type);
      console.log("📂 Adicionando:", file.name, "com tipo detectado:", type);

      if (type === "IMAGE" || type === "VIDEO") {
        const reader = new FileReader();
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file,
              fileData: e.target.result,
              type,
            })
          );
        };
        reader.readAsDataURL(file);
      } else {
        // 👇 garante que arquivos como zip também sejam adicionados
        dispatch(
          addFiles({
            file,
            fileData: "", // sem preview
            type,
          })
        );
      }
    });
  };

  return (
    <>
      <div
        onClick={() => inputRef.current.click()}
        className="w-14 h-14 mt-2 border dark:border-white rounded-md flex items-center justify-center cursor-pointer"
      >
        <span className="rotate-45">
          <CloseIcon className="dark:fill-dark_svg_1" />
        </span>
      </div>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="*/*" // <- temporário para garantir que zip passe
        onChange={filestHandler}
      />
    </>
  );
}
