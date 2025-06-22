import { useState, useEffect } from "react";
import { ReturnIcon } from "../../../../svg";

const images = [
  "./assets/slogan/image1.png",
  "./assets/slogan/image2.png",
  "./assets/slogan/image3.png",
  "./assets/slogan/image4.png",
];

// Modal de confirmação customizado
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
        <p className="mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateGroup({ setShowCreateGroup }) {
  const [currImgIndex, setCurrImgIndex] = useState(0);
  const [user, setUser] = useState({
    name: "",
    email: "",
    picture: "",
  });
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setCurrImgIndex(i => (i + 1) % images.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/usuario/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const { user: u } = await res.json();
        setUser({ name: u.name, email: u.email, picture: u.picture });
      }
    }
    load();
  }, []);

  async function handleSave(field) {
    await fetch(`${process.env.REACT_APP_API_ENDPOINT}/usuario/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ [field]: user[field] }),
    });
    setEditMode(m => ({ ...m, [field]: false }));
  }

  async function handleChangePic(file) {
    const cd = process.env.REACT_APP_CLOUD_NAME;
    const up = process.env.REACT_APP_CLOUD_SECRET;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", up);

    const r2 = await fetch(`https://api.cloudinary.com/v1_1/${cd}/image/upload`, {
      method: "POST",
      body: fd,
    });
    const d2 = await r2.json();
    setUser(u => ({ ...u, picture: d2.secure_url }));
    await fetch(`${process.env.REACT_APP_API_ENDPOINT}/usuario/me`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ picture: d2.secure_url }),
    });
  }

  async function handleResetPassword() {
    const r = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/usuario/redefinir-senha`, {
      method: "POST",
      credentials: "include",
    });
    alert(r.ok ? "Senha redefinida" : "Erro");
  }

  async function handleDeleteConfirmed() {
    const r = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/usuario/deletar`, {
      method: "DELETE",
      credentials: "include",
    });
    if (r.ok) alert("Conta deletada");
    else alert("Erro ao deletar conta");
    setShowConfirmDelete(false);
  }

  return (
    <div className="createGroupAnimation relative flex0030 h-full z-40">
      <button
        onClick={() => setShowCreateGroup(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>
      <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-full">
        <h1 className="text-2xl font-bold mb-2">Meus Dados</h1>

        {/* Foto */}
        <div className="flex items-center gap-4">
          <img
            src={user.picture || "./assets/user-placeholder.png"}
            alt="Perfil"
            className="w-16 h-16 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => handleChangePic(e.target.files[0])}
          />
        </div>

        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Nome</label>
          <input
            disabled={!editMode.name}
            className="border p-2 rounded"
            value={user.name}
            onChange={e => setUser(u => ({ ...u, name: e.target.value }))}
          />
          <div className="flex gap-2 mt-1">
            {!editMode.name ? (
              <button
                onClick={() => setEditMode(m => ({ ...m, name: true }))}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Editar
              </button>
            ) : (
              <button
                onClick={() => handleSave("name")}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Salvar
              </button>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Email</label>
          <input
            disabled={!editMode.email}
            className="border p-2 rounded"
            value={user.email}
            onChange={e => setUser(u => ({ ...u, email: e.target.value }))}
          />
          <div className="flex gap-2 mt-1">
            {!editMode.email ? (
              <button
                onClick={() => setEditMode(m => ({ ...m, email: true }))}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Editar
              </button>
            ) : (
              <button
                onClick={() => handleSave("email")}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Salvar
              </button>
            )}
          </div>
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Senha</label>
          <input
            type="password"
            disabled
            value="********"
            className="border p-2 rounded"
          />
          <button
            onClick={handleResetPassword}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Redefinir
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href="/dados-empresariais"
            className="px-6 py-2 bg-indigo-600 text-white rounded"
          >
            Dados Empresariais
          </a>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="px-6 py-2 bg-red-600 text-white rounded"
          >
            Deletar Conta
          </button>
        </div>
      </div>

      {showConfirmDelete && (
        <ConfirmModal
          message="Confirma exclusão da conta?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </div>
  );
}
