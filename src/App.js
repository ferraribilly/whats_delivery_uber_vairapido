import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { io } from "socket.io-client";
import SocketContext from "./context/SocketContext";
//Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import EscolherPerfil from "./pages/escolherperfil";
import RegisterUber from "./pages/registeruber";
import Store from "./components/Store/Store";
import ConfirmarPagamento from "./pages/confirmarpagamento";

//socket io
const socket = io(process.env.REACT_APP_API_ENDPOINT.split("/api/v1")[0]);

function RedirectToStatic({ path }) {
  useEffect(() => {
    window.location.href = path;
  }, [path]);

  return null;
}

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  return (
    <div className="dark">
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={token ? <Home socket={socket} /> : <Navigate to="/login" />}
            />
            <Route
              exact
              path="/escolherperfil"
              element={!token ? <EscolherPerfil /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/register"
              element={!token ? <Register /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/registeruber"
              element={!token ? <RegisterUber /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/pagamento_taxas"
              element={!token ? <Store /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/confirmar-pagamento"
              element={token ? <ConfirmarPagamento /> : <Navigate to="/login" />}
            />

            {/* Rota para abrir o HTML estático em public/calculo_rota/index.html */}
            <Route
              exact
              path="/calculo_rota"
              element={<RedirectToStatic path="/calculo_rota/index.html" />}
            />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
