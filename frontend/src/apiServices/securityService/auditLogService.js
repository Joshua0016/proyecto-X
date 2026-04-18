const BASE_URL = "/api/AuditLog";

export async function getAllAuditLogs(apiClient) {
  const response = await apiClient.fetch(BASE_URL);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al obtener auditorías");
  }
  return response.json();
}
