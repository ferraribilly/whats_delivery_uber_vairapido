import axios from "axios";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { FilterIcon, ReturnIcon, SearchIcon } from "../../../svg";

const Search = forwardRef(({ searchLength, setSheetResults }, ref) => {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);
  const [resultados, setResultados] = useState([]);

  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResultados(data);
        setSheetResults(data);
      } catch (error) {
        console.log(error?.response?.data?.error?.message || "Erro ao buscar usuários");
      }
    } else {
      setResultados([]);
      setSheetResults([]);
    }
  };

  // Expor função para uso externo (via ref)
  useImperativeHandle(ref, () => ({
    filtrarPorTipoVeiculo(tipo) {
      const filtrados = resultados.filter(
        (contato) => contato.tipoVeiculo === tipo
      );
      setSheetResults(filtrados);
    },
  }));

  return (
    <div className="h-[49px] py-1.5">
      <div className="px-[10px]">
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2">
            {show || searchLength > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => {
                  setResultados([]);
                  setSheetResults([]);
                }}
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
              placeholder="Para onde vamos hoje?"
              className="input"
              onFocus={() => setShow(true)}
              onBlur={() => searchLength === 0 && setShow(false)}
              onKeyDown={(e) => handleSearch(e)}
            />
          </div>
          <button className="btn">
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default Search;
