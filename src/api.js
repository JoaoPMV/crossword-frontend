// eslint-disable-next-line no-undef
const API_URL = import.meta.env.VITE_API_URL;

// Função para registrar um usuário
export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao registrar o usuário");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Função para autenticar o login de um usuário
export const loginUser = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao fazer login");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Função para buscar jogos
export const fetchGames = async (level) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/api/games/level/${level}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar jogos (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na API:", error.message);
    throw error;
  }
};

// Função para buscar todos os níveis
export const fetchLevels = async () => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/api/games/levels`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar níveis (Status: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar níveis:", error.message);
    throw error;
  }
};
