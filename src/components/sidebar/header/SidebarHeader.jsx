import { useSelector } from "react-redux";
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../../../svg";
import { useState } from "react";
import Menu from "./Menu";
// Importar CreateGroup como exportação nomeada
import { CreateGroup } from "./createGroup";
// Dados parece estar ok, mantendo
import Dados from "./createGroup/Dados";
// import RegisterUber from "../../../pages/registeruber";
// import RegisterEstabelecimento from "../../../pages/registerestabelecimento";
// import RegisterVendaConteudo from "../../../pages/registervendaconteudo";

export default function SidebarHeader() {
  const { user } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showDados, setShowDados] = useState(false);
  // const [showRegisterUber, setShowRegisterUber] = useState(false);
  // const [showRegisterEstabelecimento, setShowRegisterEstabelecimento] = useState(false);
  // const [showRegisterVendaConteudo, setShowRegisterVendaConteudo] = useState(false);

  // Controle para caixa do CommunityIcon
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  // Controle para caixa do StoryIcon (novo)
  const [showVehicleSelectorStory, setShowVehicleSelectorStory] = useState(false);

  const handleVehicleSelect = (vehicle) => {
    console.log("Selecionado:", vehicle);
    setShowVehicleSelector(false);
    setShowVehicleSelectorStory(false);

    // Aqui você pode adicionar sua lógica: ex: dispatch, navegação, etc.
  };

  return (
    <>
      {/* Sidebar header */}
      <div className="h-[70px] w-full bg-white flex items-center p16">
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
            {/* Botão CommunityIcon com caixa de opções */}
            <li className="relative">
              <button
                className="btn"
                onClick={() => setShowVehicleSelector((prev) => !prev)}
              >
                <CommunityIcon className="dark:fill-dark_svg_1" />
              </button>

              {showVehicleSelector && (
                <div className="absolute top-10 right-0 bg-dark_bg_2 text-white shadow-lg rounded-lg p-2 z-50 w-40">
                  <button
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-dark_hover_1 transition-colors"
                    onClick={() => handleVehicleSelect("Moto")}
                  >
                    Moto
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-dark_hover_1 transition-colors"
                    onClick={() => handleVehicleSelect("Carro")}
                  >
                    Carro
                  </button>
                </div>
              )}
            </li>

            {/* Botão StoryIcon */}
            <li className="relative">
              <button
                className="btn"
                onClick={() => setShowVehicleSelectorStory((prev) => !prev)}
              >
                <StoryIcon className="dark:fill-dark_svg_1" />
              </button>

              {showVehicleSelectorStory && (
                <div className="absolute top-10 right-0 bg-dark_bg_2 text-white shadow-lg rounded-lg p-2 z-50 w-40">
                  <button
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-dark_hover_1 transition-colors"
                    onClick={() => handleVehicleSelect("Lanchonete")}
                  >
                    Lanchonete
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-dark_hover_1 transition-colors"
                    onClick={() => handleVehicleSelect("Pizzaria")}
                  >
                    Pizzaria
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-dark_hover_1 transition-colors"
                    onClick={() => handleVehicleSelect("Restaurante")}
                  >
                    Restaurante
                  </button>
                </div>
              )}
            </li>

            {/* Botão ChatIcon */}
            <li>
              <button className="btn">
                <ChatIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>

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
                  setShowCreateGroup={setShowCreateGroup}
                  setShowDados={setShowDados}
                  // setShowRegisterUber={setShowRegisterUber}
                  // setShowRegisterEstabelecimento={setShowRegisterEstabelecimento}
                  // setShowREgisterVendaConteudo={setShowRegisterVendaConteudo}
                  setShowMenu={setShowMenu}
                />
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Create Group */}
      {showCreateGroup && (
        <CreateGroup setShowCreateGroup={setShowCreateGroup} />
      )}

      {/* Dados */}
      {showDados && <Dados setShowDados={setShowDados} />}

      {/* Register Uber */}
      {/* {showRegisterUber && (
        <RegisterUber setShowRegisterUber={setShowRegisterUber} />
      )} */}

      {/* Register Estabelecimento */}
      {/* {showRegisterEstabelecimento && (
        <RegisterEstabelecimento setShowRegisterEstabelecimento={setShowRegisterEstabelecimento} />
      )} */}

      {/* Register Venda Conteudo */}
      {/* {showRegisterVendaConteudo && (
        <RegisterVendaConteudo setShowRegisterVendaConteudo={setShowRegisterVendaConteudo} />
      )} */}
    </>
  );
}
