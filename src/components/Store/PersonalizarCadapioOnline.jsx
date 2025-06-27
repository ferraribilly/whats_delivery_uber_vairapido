import React from "react";

export default function Cardapio() {
  const produtos = [
    {
      id: 1,
      tipo: "hamburguer",
      nome: "Cheese Burger Duplo",
      descricao:
        "Pão levinho de fermentação natural, hamburger de 160g, queijo prato e maionese da casa.",
      preco: 28.9,
      img: "/assets/img/hamb-1.png",
    },
    {
      id: 2,
      tipo: "hamburguer",
      nome: "Cheese Bacon Duplo",
      descricao:
        "Pão levinho de fermentação natural, hamburger de 160g, queijo prato e maionese da casa.",
      preco: 18.9,
      img: "/assets/img/hamb-2.png",
    },
    {
      id: 3,
      tipo: "hamburguer",
      nome: "Smash Burger",
      descricao:
        "Pão levinho de fermentação natural, hamburger de 160g, queijo prato e maionese da casa.",
      preco: 32.9,
      img: "/assets/img/hamb-3.png",
    },
    {
      id: 4,
      tipo: "hamburguer",
      nome: "Cheese Salada",
      descricao: "Hamburger com queijo, alface, tomate e maionese da casa.",
      preco: 29.9,
      img: "/assets/img/hamb-1.png",
    },
    {
      id: 5,
      tipo: "hamburguer",
      nome: "X-Tudo",
      descricao: "Hamburger completo com tudo que você tem direito.",
      preco: 35.9,
      img: "/assets/img/hamb-2.png",
    },
    {
      id: 6,
      tipo: "hamburguer",
      nome: "Big Burguer",
      descricao: "Hamburger gigante para matar a fome de verdade.",
      preco: 33.9,
      img: "/assets/img/hamb-3.png",
    },
    {
      id: 7,
      tipo: "bebida",
      nome: "Suco Natural",
      descricao: "Suco natural de laranja, 300ml.",
      preco: 8.9,
      img: "/assets/img/refri-2.png",
    },
    {
      id: 8,
      tipo: "bebida",
      nome: "Suco Natural",
      descricao: "Suco natural de laranja, 300ml.",
      preco: 8.9,
      img: "/assets/img/refri-2.png",
    },
    {
      id: 9,
      tipo: "bebida",
      nome: "Guaraná Antarctica",
      descricao: "Refrigerante tradicional bem gelado, 350ml.",
      preco: 7.9,
      img: "/assets/img/refri-1.png",
    },
    {
      id: 10,
      tipo: "bebida",
      nome: "Água Mineral",
      descricao: "Garrafa de água mineral sem gás, 500ml.",
      preco: 4.5,
      img: "/assets/img/refri-2.png",
    },
  ];

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          font-family: Arial, sans-serif;
        }
        .cardapio-digital-mu-woad {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          background: #fff;
        }
        main.container {
          flex-grow: 1;
          max-width: 960px;
          margin: 0 auto;
          padding: 0 1rem;
          padding-bottom: 120px;
        }
        .card-item {
          display: flex;
          gap: 1rem;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 6px;
          align-items: center;
          box-shadow: 0 0 6px rgb(0 0 0 / 0.1);
          background: #fafafa;
          flex-wrap: wrap;
        }
        .card-item:hover img {
          transform: scale(1.1) rotate(-2deg);
        }
        .card-item img {
          width: 112px;
          height: 112px;
          border-radius: 6px;
          transition: transform 0.3s;
          object-fit: cover;
        }
        .preco {
          font-weight: bold;
          font-size: 1.25rem;
          margin-top: 0.5rem;
        }
      `}</style>

      <section className="cardapio-digital-mu-woad">
        <header
          className="w-full h-[420px] bg-zinc-900 bg-header bg-cover bg-center flex flex-col justify-center items-center"
          style={{ backgroundColor: "#222" }}
        >
          {/**/}
          <img
            id="logo-marca"
            src="./assets/img/hamb-1.png"
            alt="Logo Dev Burguer"
            className="w-32 h-32 rounded-full shadow-lg hover:scale-110 duration-200"
          />
          {/**Aqui vai Preencher com as inferomacoes salva no registro*/}
          <h1 className="text-4xl mt-4 mb-2 font-bold text-white" id="slogan"></h1>

            {/**Aqui vai Preencher com as inferomacoes salva no registro*/}
          <span className="font-medium text-white" id="endereco-estabelecimento">
            
          </span>
          <div
            id="date-span"
            className="bg-green-600 px-4 py-1 rounded-lg mt-5"
            style={{ marginBottom: "2rem" }}
          >
              {/**Aqui vai adicionar e salvar no banco*/}
            <span className="font-medium text-white" id="horario-fucionamento">segunda á domingo das 18:00 as 22:00</span>
          </div>
        </header>

        <main className="container mx-auto px-4 mt-8 mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Conheça nosso cardápio
          </h2>

          <div
            id="itens"
            className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mx-auto max-w-7xl px-2"
          >
            {produtos.map((produto) => (
              <div key={produto.id} className="card-item">
                <img src={produto.img} alt={produto.nome} />
                <div style={{ flexGrow: 1 }}>
                  <p className="font-bold">{produto.nome}</p>
                  <p className="text-sm">{produto.descricao}</p>
                  <p className="preco">R$ {produto.preco.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </section>
    </>
  );
}
