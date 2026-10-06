const API_URL = import.meta.env.VITE_API_URL;

function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

export async function fetchLevels() {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return [];
  }

  const response = await fetch(`${API_URL}/levels`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    return [];
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar os níveis");
  }

  return response.json();
}

export async function fetchLevel(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return null;
  }

  const response = await fetch(`${API_URL}/levels/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    return null;
  }

  if (response.status === 403) {
    throw new Error(
      "Este nível não está disponível para o seu nível de inglês",
    );
  }

  if (response.status === 404) {
    throw new Error("Nível não encontrado");
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar o nível");
  }

  return response.json();
}
