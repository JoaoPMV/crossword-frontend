import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // ajuste o caminho se for diferente

export default function Logout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // 1. Limpa storage
    localStorage.removeItem("authToken");
    // 2. Limpa contexto
    setUser(null);
    // 3. Redireciona para login
    navigate("/", { replace: true });
  }, [navigate, setUser]);

  // Opcional: algum texto/loading, mas não é obrigatório
  return null;
}
