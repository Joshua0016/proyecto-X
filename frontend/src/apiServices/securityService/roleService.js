const BASE_URL = "/api/Role";

export async function getAllRoles(apiClient) {
  const response = await apiClient.fetch(`${BASE_URL}/GetAll`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al obtener roles");
  }
  return response.json();
}
