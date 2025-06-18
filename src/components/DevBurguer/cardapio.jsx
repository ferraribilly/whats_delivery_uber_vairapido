import React, { useState } from "react";

export default function Cardapio() {
  const [cart, setCart] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [endereco, setEndereco] = useState("");

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

  function adicionarAoCarrinho(produto) {
    const itemExistente = cart.find((item) => item.id === produto.id);
    if (itemExistente) {
      const novoCarrinho = cart.map((item) =>
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      );
      setCart(novoCarrinho);
    } else {
      setCart([...cart, { ...produto, quantidade: 1 }]);
    }
  }

  function removerDoCarrinho(produto) {
    const itemExistente = cart.find((item) => item.id === produto.id);
    if (itemExistente) {
      if (itemExistente.quantidade > 1) {
        const novoCarrinho = cart.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade - 1 } : item
        );
        setCart(novoCarrinho);
      } else {
        setCart(cart.filter((item) => item.id !== produto.id));
      }
    }
  }

  function calcularTotal() {
    return cart
      .reduce((acc, item) => acc + item.preco * item.quantidade, 0)
      .toFixed(2);
  }

  function enviarPedido(e) {
    e.preventDefault();
    const mensagem = cart
      .map(
        (item) =>
          `${item.nome} - Quantidade: (${item.quantidade}) - Preço: R$ ${item.preco.toFixed(2)}`
      )
      .join("\n");

    const total = `Total a Pagar: R$ ${calcularTotal()}`;
    const enderecoFinal = `Endereço: ${endereco}`;

    const linkWhatsApp = `https://wa.me/SEU_NUMERO?text=${encodeURIComponent(
      mensagem + "\n" + total + "\n" + enderecoFinal
    )}`;

    window.open(linkWhatsApp, "_blank");

    setCart([]);
    setEndereco("");
    setMostrarFormulario(false);
  }

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
          padding-bottom: 120px; /* espaço para footer fixo */
        }
        .card-item {
          display: flex;
          gap: 1rem;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 6px;
          align-items: center;
          box-shadow: 0 0 6px rgb(0 0 0 / 0.1);
          transition: transform 0.3s;
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
        .btn-adicionar, .btn-remover {
          background-color: blue;
          color: #333;
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          transition: background-color 0.3s, color 0.3s;
          user-select: none;
        }
        .btn-adicionar:hover {
          background-color: #38a169;
          color: white;
        }
        .btn-remover:hover {
          background-color: #e53e3e;
          color: white;
        }
        footer.carrinho-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #222;
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }
        footer.carrinho-footer button {
          background: #38a169;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        form.pedido-form {
          position: fixed;
          bottom: 70px;
          right: 20px;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 0 12px rgba(0,0,0,0.3);
          max-width: 320px;
          z-index: 20;
        }
        form.pedido-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        form.pedido-form input, form.pedido-form textarea {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          resize: vertical;
        }
        form.pedido-form button {
          background: #3182ce;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          width: 100%;
        }
        ul {
          list-style: none;
          padding-left: 0;
          max-height: 100px;
          overflow-y: auto;
        }
        ul li {
          margin-bottom: 0.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        ul li button {
          background: transparent;
          border: none;
          color: #e53e3e;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
          margin-left: 8px;
        }
      `}</style>

      <section className="cardapio-digital-mu-woad">
        <header
          className="w-full h-[420px] bg-zinc-900 bg-header bg-cover bg-center flex flex-col justify-center items-center"
          style={{ backgroundColor: "#222" }}
        >
          <img
            src="./assets/img/hamb-1.png"
            alt="Logo Dev Burguer"
            className="w-32 h-32 rounded-full shadow-lg hover:scale-110 duration-200"
          />
          <h1 className="text-4xl mt-4 mb-2 font-bold text-white">Ferrari Delivery</h1>
          <span className="font-medium text-white">
            Rua Seu Endereço, nº 10, Seu Bairro - Franca/SP
          </span>
          <div
            id="date-span"
            className="bg-green-600 px-4 py-1 rounded-lg mt-5"
            style={{ marginBottom: "2rem" }}
          >
            <span className="font-medium text-white">Seg à Dom - 18:00 às 22:00</span>
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
                  <div
                    className="flex flex-col items-start justify-between mt-3"
                    style={{ gap: "0.3rem", flexDirection: "row", alignItems: "center" }}
                  >
                    <p className="font-bold text-lg" style={{ marginRight: "auto" }}>
                      R$ {produto.preco.toFixed(2)}
                    </p>
                    <button
                      className="btn-adicionar"
                      onClick={() => adicionarAoCarrinho(produto)}
                      aria-label={`Adicionar ${produto.nome} ao carrinho`}
                      title="Adicionar"
                      type="button"
                    >
                      🛒
                    </button>
                    <button
                      className="btn-remover"
                      onClick={() => removerDoCarrinho(produto)}
                      aria-label={`Remover ${produto.nome} do carrinho`}
                      title="Remover"
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {cart.length > 0 && (
          <footer className="carrinho-footer">
            <div>
              {cart.reduce((acc, item) => acc + item.quantidade, 0)} item
              {cart.reduce((acc, item) => acc + item.quantidade, 0) > 1 ? "s" : ""} no
              carrinho - Total: R$ {calcularTotal()}
            </div>
            <button onClick={() => setMostrarFormulario(true)}>Finalizar Pedido</button>
          </footer>
        )}

        {mostrarFormulario && (
          <form className="pedido-form" onSubmit={enviarPedido}>
            <label>Itens do pedido:</label>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.nome} x {item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                  <button
                    type="button"
                    aria-label={`Remover ${item.nome} do pedido`}
                    title="Remover do pedido"
                    onClick={() => removerDoCarrinho(item)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
            <label htmlFor="endereco">Endereço para entrega:</label>
            <textarea
              id="endereco"
              required
              rows={3}
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            <button type="submit">Enviar Pedido</button>
            <button
              type="button"
              style={{ marginTop: "0.5rem", backgroundColor: "#ccc", color: "#000" }}
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>
          </form>
        )}
      </section>
    </>
  );
}
