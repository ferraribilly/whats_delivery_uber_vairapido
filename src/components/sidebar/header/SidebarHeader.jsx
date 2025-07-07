import { useSelector } from "react-redux";
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../../../svg";
import { useState } from "react";
import Menu from "./Menu";
import { MinhaConta, Map, SobreUsoApp, CardapioOnlines } from "./createGroup";

export default function SidebarHeader() {
  const { user } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showMinhaConta, setShowMinhaConta] = useState(false);
  const [showSobreUsoApp, setShowSobreUsoApp] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [ShowCardapioOnlines, setShowCardapioOnlines] = useState(false);

  const status = user?.status;

  // Controle para caixa do CommunityIcon
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  // Controle para caixa do StoryIcon (novo)
  const [showVehicleSelectorStory, setShowVehicleSelectorStory] = useState(false);

  const handleVehicleSelect = (vehicle) => {
    console.log("Selecionado:", vehicle);
    setShowVehicleSelector(false);
    setShowVehicleSelectorStory(false);
  };

  return (
    <>
      {/* Sidebar header */}
      <div className="h-[70px] w-full bg-dark flex items-center p16">
        {/* container */}
        <div className="w-full flex items-center justify-between">
          {/* user image */}
          <button className="btn">
            <img
              src={user.picture}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </button>

          {/* user icons */}
          <ul className="flex items-center gap-x-2.5 relative">
            {/* Botão CommunityIcon redireciona para URL */}
            {/* <li className="relative">
              <a
                href="/calculo_rota/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                <CommunityIcon className="dark:fill-dark_svg_1" />
              </a>
            </li> */}




            {/* Mostra só se status for "uber" */}
            {status === "" && (
              <li className="relative">
                <a
                  href="https://waze.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  <StoryIcon className="dark:fill-dark_svg_1" />
                </a>
              </li>
            )}

            {/* Menu com 3 pontinhos */}
            <li
              className="relative"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <button className={`btn ${showMenu ? "bg-dark_hover_1" : ""}`}>
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
              {showMenu && (
                <Menu
                  setShowMinhaConta={setShowMinhaConta}
                  setShowMap={setShowMap}
                  setShowSobreUsoApp={setShowSobreUsoApp}
                  setShowCardapioOnlines={setShowCardapioOnlines}
                  setShowMenu={setShowMenu}
                  
                />
              )}
            </li>
          </ul>
        </div>
      </div>

      {/*Minha Conta */}
      {showMinhaConta && (
        <MinhaConta setShowMinhaConta={setShowMinhaConta} />
      )}

      {/* Sobre App */}
      {showSobreUsoApp && (
        <SobreUsoApp setShowSobreUsoApp={setShowSobreUsoApp} />
      )}

      {/* Map */}
      {showMap && <Map setShowMap={setShowMap} />}

      {/* Cardapios Onlines */}
      {ShowCardapioOnlines && (
        <CardapioOnlines setShowCardapioOnlines={setShowCardapioOnlines} />
      )}
    </>
  );
}
