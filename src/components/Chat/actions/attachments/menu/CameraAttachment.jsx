import { useRef } from "react";
import { CameraIcon } from "../../../../../svg";
import { useDispatch } from "react-redux";
import { addFiles } from "../../../../../features/chatSlice";
import { getFileType } from "../../../../../utils/file";

export default function CameraAttachment() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const imageHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        ![
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/mpeg",
          "video/webm",
        ].includes(file.type)
      ) {
        return;
      }
      if (file.size > 1024 * 1024 * 10) {
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        dispatch(
          addFiles({
            file: file,
            fileData: event.target.result,
            type: getFileType(file.type),
          })
        );
      };
    });
  };

  return (
    <li>
      <button
        type="button"
        className="bg-[#BF59CF] rounded-full"
        onClick={() => inputRef.current.click()}
      >
        <CameraIcon />
      </button>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/*,video/*"
        capture="environment" // usa câmera traseira, ou "user" para frontal
        onChange={imageHandler}
      />
    </li>
  );
}
