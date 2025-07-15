import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FilterIcon, ReturnIcon, CommunityIcon, SearchIcon } from "../../../svg";

export default function Search({ searchLength, setSheetResults }) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);
  const [searchText, setSearchText] = useState(""); // Estado para controlar o texto da pesquisa
  const [isBlinking, setIsBlinking] = useState(false); // Estado para controlar o piscar

  // Função para buscar por um termo (carro, moto, etc)
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
          error?.response?.data?.error?.message || "Erro ao buscar usuários"
        );
      }
    } else {
      setSheetResults([]);
    }
  };

  // Função que será chamada ao pressionar "Enter" na barra de pesquisa
  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      await buscar(e.target.value);
    }
  };

  // Limpar resultados ao pressionar o botão de retorno
  const clearSearch = () => {
    setSheetResults([]);
    setSearchText(""); // Limpar texto da pesquisa
  };

  // Função para lidar com o clique no ícone "carro" ou "moto"
  const handleIconClick = (termo) => {
    setSearchText(termo);
    setIsBlinking(true); // Inicia o efeito de piscar
    setTimeout(() => {
      setIsBlinking(false); // Para o piscar após um tempo
    }, 500);
    buscar(termo);
  };

  return (
    <div className="h-[49px] py-1.5">
      <div className="px-[10px]">
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:white rounded-lg pl-2">
            {show || searchLength > 0 ? (
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
              value={searchText} // Valor controlado
              placeholder="Clique nos ícones para buscar"
              className={`input ${isBlinking ? "blink" : ""}`} // Aplica o efeito de piscar
              onFocus={() => setShow(true)}
              onBlur={() => searchLength === 0 && setShow(false)}
              onKeyDown={handleSearch}
              readOnly={true} // Impede edição manual, já que os ícones controlam o texto
            />
          </div>
          {/* Botão para buscar "carro" */}
          <button className="btn" onClick={() => handleIconClick("carro")}>
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
          {/* Botão para buscar "moto" */}
          <button className="btn" onClick={() => handleIconClick("moto")}>
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
        </div>
      </div>
    </div>
  );
}
