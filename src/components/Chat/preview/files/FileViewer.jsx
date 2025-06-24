import { useSelector } from "react-redux";

export default function FileViewer({ activeIndex }) {
  const { files } = useSelector((state) => state.chat);
  const file = files[activeIndex];
  if (!file) return null;

  const isImage = file.type === "IMAGE";
  const isVideo = file.type === "VIDEO";

  const fileUrl = file.fileData || (file.file ? URL.createObjectURL(file.file) : "");

  const handleOpenFile = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="w-full max-w-[60%]">
      <div className="flex justify-center items-center">
        {isImage ? (
          <img
            src={fileUrl}
            alt=""
            className="max-w-[80%] object-contain hview"
            onClick={handleOpenFile}
            style={{ cursor: "pointer" }}
          />
        ) : isVideo ? (
          <video
            src={fileUrl}
            controls
            className="max-w-[80%] object-contain hview"
            onClick={handleOpenFile}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <div
            className="min-w-full hview flex flex-col items-center justify-center cursor-pointer"
            onClick={handleOpenFile}
          >
            <img
              src={`../../../../images/file/${file.type}.png`}
              alt={file.type}
              className="w-12 h-12 mb-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "../../../../images/file/ZIP.png";
              }}
            />
            <h1 className="dark:text-dark_text_2 text-2xl">Clique para abrir</h1>
            <span className="dark:text-dark_text_2 text-sm mt-1">
              {file?.file?.name} - {file?.file?.size} bytes
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
