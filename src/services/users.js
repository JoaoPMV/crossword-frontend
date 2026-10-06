const API_URL = import.meta.env.VITE_API_URL;

export async function createUser(user) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const firstError = data.errors?.[0]?.defaultMessage;
    throw new Error(
      firstError || data.message || "Não foi possível criar o usuário",
    );
  }

  return data;
}

export async function loginUser(user) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Invalid email or password");
  }

  return response.text();
}

export async function resetPassword(token, password) {
  const response = await fetch(`${API_URL}/users/reset-password`, {
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
    throw new Error("Failed to reset password");
  }

  return response.text();
}

export async function forgotPassword(email) {
  const response = await fetch(
    `${API_URL}/users/forgot-password?email=${encodeURIComponent(email)}`,
    { method: "POST" },
  );
  return response.text();
}

export async function logoutUser() {
  const token = localStorage.getItem("token");

  if (token) {
    await fetch(`${API_URL}/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  localStorage.removeItem("token");

  window.location.href = "/";
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error("Não foi possível carregar o perfil");
  }

  return data;
}

export async function updateUser(id, user) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(user),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const firstError = data.errors?.[0]?.defaultMessage;
    throw new Error(
      firstError || data.message || "Não foi possível atualizar o perfil",
    );
  }

  return data;
}

export function getUserIdFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );

    return payload.userId;
  } catch {
    return null;
  }
}
