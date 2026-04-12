/**
 * Funciones de API para autenticación.
 * Estas funciones usan fetch directo (sin ApiClient) ya que se usan antes de que
 * la autenticación esté establecida. La excepción es changePasswordRequest que
 * requiere autenticación y usa el apiClient.
 */

const BASE_URL = "/api/User";

/**
 * Realiza login con email y contraseña.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ userId: number, name: string, token: string, refreshToken: string, email: string, rol: string }>}
 */
export async function loginRequest(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Email: email, Password: password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al iniciar sesión");
  }

  return response.json();
}

/**
 * Registra un nuevo usuario.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {number} idRol - Rol del usuario (default: 2 = usuario normal)
 * @returns {Promise<{ message: string }>}
 */
export async function registerRequest(name, email, password, idRol = 2) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Name: name, Email: email, Password: password, IdRol: idRol }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al registrar usuario");
  }

  return response.json();
}

/**
 * Renueva el access token usando un refresh token.
 * @param {string} refreshToken
 * @returns {Promise<{ token: string, refreshToken: string }>}
 */
export async function refreshTokenRequest(refreshToken) {
  const response = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ RefreshToken: refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al renovar token");
  }

  return response.json();
}

/**
 * Cambia la contraseña del usuario. Requiere autenticación (usa apiClient).
 * @param {{ fetch: (url: string, options?: RequestInit) => Promise<Response> }} apiClient
 * @param {number} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function changePasswordRequest(apiClient, userId, currentPassword, newPassword) {
  const response = await apiClient.fetch(`${BASE_URL}/${userId}/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ CurrentPassword: currentPassword, NewPassword: newPassword }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al cambiar contraseña");
  }
}
