const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProgress(userId, levelId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/progress/${userId}/${levelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;

  return response.json();
}

export async function saveProgressRequest(progress) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(progress),
  });

  if (!response.ok) return null;

  return response.json();
}
