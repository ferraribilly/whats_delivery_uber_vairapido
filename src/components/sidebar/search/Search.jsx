import axios from "axios";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { FilterIcon, ReturnIcon, SearchIcon } from "../../../svg";
import { Contact } from "lucide-react";

const Search = forwardRef(({ searchLength, setSheetResults }, ref) => {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [show, setShow] = useState(false);
  const [resultados, setResultados] = useState([]);

  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      buscarPorTermo(e.target.value);
    } else if (e.key === "Enter") {
      setResultados([]);
      setSheetResults([]);
    }
  };

  const buscarPorTermo = async (termo) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/user?search=${termo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResultados(data);
      setSheetResults(data);
    } catch (error) {
      console.log(
        error?.response?.data?.error?.message || "Erro ao buscar usuários"
      );
    }
  };

  useImperativeHandle(ref, () => ({
    filtrarPorTipoVeiculo(tipo) {
      buscarPorTermo(tipo);
    },
  }));

  const buscarPorTipoVeiculo = async (tipo) => {
    await buscarPorTermo(tipo);
  };

  const calcularPrecoDinamico = (user) => {
    return "R$ 0,00"; // Placeholder
  };

  return (
    <div className="h-[49px] py-1.5">
      <div className="px-[50px]">
        <div className="flex items-center gap-x-3">
          <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2">
            {show || searchLength > 1 ? (
              <span
                className="w-62 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => {
                  setResultados([]);
                  setSheetResults([]);
                }}
              >
                <ReturnIcon className="fill-green_1 w-12" />
              </span>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>

      {/* ==== CARDS ESCOLHER CARRO ==== */}
      <div
        className="w-auto mt-6 space-y-4 "
        onClick={() => buscarPorTipoVeiculo("carro")} // está certo aqui
      >
        <div className="flex items-center justify-between bg-dark p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="/assets/img/UberX.png"
              alt="Carro"
              className="w-16 h-16"
            />
            <h2 className="text-gold font-bold mt-2">VAI DE CARRO ##</h2>
          </div>
        </div>
      </div>

      {/* ==== CARDS ESCOLHER MOTO ==== */}
      <div
        className="w-auto mt-6 space-y-4"
        onClick={() => buscarPorTipoVeiculo("moto")}
      >
        <div className="flex items-center justify-between bg-dark p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="/assets/img/moto.png"
              alt="Moto"
              className="w-16 h-16"
            />
            <h2 className="text-blue-700 font-bold mt-2">VAI DE MOTO ##</h2>
          </div>
        </div>
      </div>

      {/* ==== CARDS ESCOLHER ENTREGADORES ==== */}
      <div
        className="w-auto mt-6 space-y-4"
        onClick={() => buscarPorTipoVeiculo("entregador")} 
      >
        <div className="flex items-center justify-between bg-dark p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="/assets/img/entregadores.png"
              alt="Entregador"
              className="w-16 h-16"
            />
            <p className="text-green-700 font-bold mt-2">ENTREGAS ##</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Search;
