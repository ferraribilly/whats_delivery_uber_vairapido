import { Logo } from "../../../svg";

export default function WhatsappHome({ setShowSidebar, openCardapio, openMap, }) {
  const handleDelivery = () => {
    console.log("Abrir Cardápio Digital - Delivery");
    if (openCardapio) {
      openCardapio(); // chama a função para abrir o cardápio
    }
  };

  const handleMap = () => {
    console.log("Abrir Map");
    if (openMap) {
      openMap();
    }
  
  };

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
            Whatsapp Ferrari Bussines.
            <br />
            Use Whatsapp em seus sistemas Delivery, e Uber e Empresas.
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-y-2 mt-4">
          {/* Botão Sidebar */}
          <button
            onClick={() => setShowSidebar(true)}
            className="px-4 py-2 bg-green_2 text-white rounded"
          >
            Abrir Sidebar
          </button>

          {/* Botão Delivery */}
          <button
            onClick={handleDelivery}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Delivery - Cardápio Digital
          </button>

          {/* Botão Uber */}
          <button
            onClick={handleMap}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Uber - Em breve
          </button>
        </div>
      </div>
    </div>
  );
}
