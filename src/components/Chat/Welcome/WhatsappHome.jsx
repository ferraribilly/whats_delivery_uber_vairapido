import { useEffect } from "react";
import { Logo } from "../../../svg";

export default function WhatsappHome({ setShowSidebar }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSidebar(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [setShowSidebar]);

  return (
    <div className="h-full w-full dark:bg-dark_bg_4 select-none border-l dark:border-l-dark_border_2 border-b-[6px] border-b-green_2">
      {/* Container */}
      <div className="-mt-1.5 w-full h-full flex flex-col gap-y-6 items-center justify-center">
        <span>
          <Logo />
        </span>

        {/* Infos */}
        <div className="mt-1 text-center space-y-[12px]">
          <h1 className="text-[32px] dark:text-dark_text_4 font-extralight">
            Whatsapp Ferrari Bussines
          </h1>
          <p className="text-sm dark:text-dark_text_3">
            Ferramenta poderosa na Palma das suas mãos por menor taxa.
            <br />
            Use Whatsapp Ferrari em seus Estabelecimento Empresas e Motorista de Aplicativos.
          </p>
        </div>

        {/* Barra de Carregamento Animada */}
        <div className="flex flex-col gap-y-2 mt-4 w-64">
          <div className="relative h-2 bg-gray-300 rounded overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-green_2 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
