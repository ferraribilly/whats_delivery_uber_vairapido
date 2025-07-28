import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../../../../svg";
import { clearFiles } from "../../../../features/chatSlice";
export default function Header({ activeIndex }) {
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.chat);
  const clearFilesHandler = () => {
    dispatch(clearFiles());
  };
  return (
    <div className="w-full z-[9999]">
      {/*Container*/}
      <div className="w-full flex items-center justify-between z-[9999]">
        {/*Close icon / empty files*/}
        <div
          className="translate-x-4 cursor-pointer z-[999]"
          onClick={() => clearFilesHandler()}
        >
          <CloseIcon className="dark:fill-dark_svg_1 z-[999]" />
        </div>
        {/* File name */}
        <h1 className="dark:text-dark_text_1 text-[15px] z-[999]">
          {files[activeIndex]?.file?.name}
        </h1>
        {/*Empty tag*/}
        <span></span>
      </div>
    </div>
  );
}
