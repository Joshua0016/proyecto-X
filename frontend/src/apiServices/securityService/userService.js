const BASE_URL = "/api/User";

export async function getProfile(apiClient, userId) {
  const response = await apiClient.fetch(`${BASE_URL}/${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al obtener perfil");
  }
  return response.json();
}

export async function updateProfile(apiClient, userId, data) {
  const response = await apiClient.fetch(`${BASE_URL}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al actualizar perfil");
  }
}
