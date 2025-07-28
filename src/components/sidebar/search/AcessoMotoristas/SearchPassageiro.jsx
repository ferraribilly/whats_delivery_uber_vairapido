import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FilterIcon, ReturnIcon, SearchIcon } from "../../../../svg";


export default function SearchPassageiro({ searchLength, setSearchResults }) {

  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);


  //mudar Handle nao sera assim sera automatico  aqui vindo banco de dados ai na mesma rota /orders 🚀

  const handleOrders = async (e) => {
    if (e.target.value && e.key === "Enter") {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/orders?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(data);
      } catch (error) {
        console.log(error.response.data.error.message);
      }
    } else {
      setSearchResults([]);
    }
  };


  return (
    <div className="h-[49px] py-1.5 ">
      {/*Container*/}
      <div className="px-[10px] ">
        {/*Search input container*/}
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:white rounded-lg pl-2">
            {show || searchLength > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
              >
                <ReturnIcon className="fill-green_1 w-5" />
              </span>
            ) : (
              <span className="w-8 flex items-center justify-center ">
                <SearchIcon className="dark:fill-dark_svg_2 w-5" />
              </span>
            )}
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="input"
              onFocus={() => setShow(true)}
              onBlur={() => searchLength == -1 && setShow(false)}
              onKeyDown={(e) => handleOrders(e)}
            />
          </div>
          {/* <button className="btn">
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
