const BASE_URL = "/api/User";

export async function getAllUsers(apiClient) {
  const response = await apiClient.fetch(BASE_URL);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al obtener usuarios");
  }
  return response.json();
}

export async function createUser(apiClient, { name, email, password, idRol }) {
  const response = await apiClient.fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Name: name, Email: email, Password: password, IdRol: idRol }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al crear usuario");
  }
}

export async function updateUser(apiClient, userId, { name, email, idRol }) {
  const response = await apiClient.fetch(`${BASE_URL}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Name: name, Email: email, IdRol: idRol }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al actualizar usuario");
  }
}

export async function deactivateUser(apiClient, userId) {
  const response = await apiClient.fetch(`${BASE_URL}/${userId}/deactivate`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al desactivar usuario");
  }
}

export async function activateUser(apiClient, userId) {
  const response = await apiClient.fetch(`${BASE_URL}/${userId}/activate`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al activar usuario");
  }
}
