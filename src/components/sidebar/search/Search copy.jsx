import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FilterIcon, ReturnIcon, SearchIcon } from "../../../svg";

export default function Search({ searchLength, setSearchResults, handleSearch }) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);
  const [partida, setPartida] = useState("");
  const [destino, setDestino] = useState("");

  const calcularCorrida = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/route/request", {
        params: {
          api_key: process.env.REACT_APP_API_PUBLIC, // no React, variáveis precisam começar com REACT_APP_
          origem: partida,
          destino: destino,
        },
        headers: {
          Authorization: `Bearer ${token}`, // se precisar do token no backend
        },
      });
      setSearchResults([data]);
    } catch (error) {
      console.log("Erro ao calcular rota:", error.response?.data || error.message);
    }
  };

  return (
    <div className="h-[200px] py-1.5">
      <div className="px-[10px] flex flex-col gap-2">
          {/*Search Ponto Partida*/}
                <div className="flex items-center gap-x-2">
                  <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2">
                    {show || searchLength > -1 ? (
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
                      id="origem"
                      type="text"
                      placeholder=" Search Motoristas"
                      className="input"
                      onFocus={() => setShow(true)}
                      onBlur={() => searchLength == -1 && setShow(false)}
                      onKeyDown={(e) => handleSearch(e)}
                    />
                  </div>
                  <button className="btn">
                    <FilterIcon className="dark:fill-dark_svg_2" />
                  </button>
                </div>
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2">
            {show || searchLength > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
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
              placeholder="Ponto de partida"
              className="input"
              value={partida}
              onChange={(e) => setPartida(e.target.value)}
              onFocus={() => setShow(true)}
              onBlur={() => searchLength == 0 && setShow(false)}
            />
          </div>
          <button className="btn">
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
        </div>

        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2">
            {show || searchLength > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
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
              placeholder="Destino"
              className="input"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              onFocus={() => setShow(true)}
              onBlur={() => searchLength == 0 && setShow(false)}
            />
          </div>
        </div>

        <button
          className="btn bg-green-600 text-white mt-2 w-[100%] py-2 rounded-md"
          onClick={calcularCorrida}
        >
          Calcular Corrida
        </button>
      </div>
    </div>
  );
}
