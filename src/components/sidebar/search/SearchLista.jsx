import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  FilterIcon,
  ReturnIcon,
  SearchIcon,
} from "../../../svg";

export default function Search({ searchLength, setSheetResults }) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isBlinking, setIsBlinking] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const buscar = async (termo) => {
    if (termo) {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user?search=${termo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSheetResults(data);
      } catch (error) {
        console.log(
          error?.response?.data?.error?.message ||
          "Erro ao buscar usuários"
        );
      }
    } else {
      setSheetResults([]);
    }
  };

  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      await buscar(e.target.value);
    }
  };

  const clearSearch = () => {
    setSheetResults([]);
    setSearchText("");
  };

  const handleOptionClick = (termo) => {
    setSearchText(termo);
    setDropdownOpen(false);
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 500);
    buscar(termo);
  };

  // Array com texto e caminho da imagem (sem import, caminho relativo ao /public)
  const opcoes = [
    { label: "carro", imgSrc: "/assets/img/UberX.png" },
    { label: "moto", imgSrc: "/assets/img/moto.png" },
    { label: "entregador", imgSrc: "/assets/img/entregadores.png" },
  ];

  return (
    <div className="h-[59px] py-1.5 relative top-10 z-[999]">
      <div className="px-[10px]">
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:white rounded-lg pl-2">
            {(show || searchLength > 0) ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={clearSearch}
              >
                <ReturnIcon className="fill-green_1 w-5" />
              </span>
            ) : (
              <span className="w-8 flex items-center justify-center">
                <SearchIcon className="dark:fill-dark_svg_2 w-5" />
              </span>
            )}
            <input
              type="text"
              value={searchText}
              placeholder="Click no icone e selecione "
              className={`input ${isBlinking ? "blink" : ""}`}
              onFocus={() => setShow(true)}
              onBlur={() => searchLength === 0 && setShow(false)}
              onKeyDown={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
         

          {/* Botão que abre o dropdown */}
          <div className="relative">
            <button
              className="btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FilterIcon className="dark:fill-dark_svg_2" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 text-white bg-white dark:bg-dark_bg_2 border rounded shadow-lg z-10 w-48">
                <ul className="text-sm text-left">
                  {opcoes.map(({ label, imgSrc }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark_hover cursor-pointer"
                      onClick={() => handleOptionClick(label)}
                    >
                      <img
                        src={imgSrc}
                        alt={label}
                        className="w-5 h-5 object-contain"
                      />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
