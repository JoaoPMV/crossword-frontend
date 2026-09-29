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

export async function getUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
  });
  return response.json();
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

  return response.json();
}

export async function forgotPassword(email) {
  const response = await fetch(
    `${API_URL}/users/forgot-password?email=${encodeURIComponent(email)}`,
    { method: "POST" },
  );
  return response.json();
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
