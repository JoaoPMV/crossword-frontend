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

// Função para solicitar recuperação de senha
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Erro ao solicitar recuperação de senha",
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Função para redefinir a senha
export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_URL}/api/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao redefinir a senha");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Função para buscar um nível
export const fetchLevel = async (level) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/api/levels/level/${level}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar nível (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na API:", error.message);
    throw error;
  }
};

// Função para buscar todos os níveis
export const fetchLevelsList = async () => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/api/levels/levels`, {
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

export const logoutUser = async () => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/api/users/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.log(data);
    throw new Error("Erro ao fazer logout");
  }

  return await response.json();
};

// Carregar o progresso do usuário
export const loadProgress = async () => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/api/progress`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Erro ao carregar o progresso");
  }

  return await response.json();
};

// Salvar o progresso do usuário
export const saveProgress = async ({
  completedPuzzles,
  currentLevel,
  currentState,
}) => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/api/progress`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      completedPuzzles,
      currentLevel,
      currentState,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Erro ao salvar o progresso");
  }

  return await response.json();
};
