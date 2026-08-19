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

export const saveProgress = async (userId, completedPuzzle, token) => {
  try {
    const response = await fetch(`${API_URL}/progress/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Passa o JWT no cabeçalho
      },
      body: JSON.stringify({ completedPuzzle }),
    });

    if (!response.ok) {
      const errorData = await response.text(); // Lê a resposta como texto
      throw new Error(errorData || "Erro ao salvar progresso");
    }

    return await response.json(); // Retorna a resposta decodificada como JSON
  } catch (error) {
    console.error("Erro ao salvar progresso na API:", error.message);
    throw error;
  }
};

export async function getProgress(userId, token) {
  try {
    const res = await fetch(`${API_URL}/progress/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json(); // Decodifica os dados de erro
      throw new Error(errorData.message || "Failed to fetch progress");
    }

    return await res.json(); // Retorna o progresso decodificado
  } catch (error) {
    console.error("Erro ao buscar progresso:", error.message);
    return null; // Retorna null em caso de erro
  }
}

// Função para buscar o usuário logado pelo token
export const fetchUserByToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Token inválido");
    }

    return await response.json(); // Deve retornar { user: ... }
  } catch (error) {
    throw new Error(error.message);
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
