import { getSession, updateTokens } from "./authService/tokenStorage";

const REFRESH_URL = "/api/User/refresh";

/**
 * Crea un ApiClient con interceptación automática de 401 y refresh de tokens.
 * @param {() => void} logoutCallback - Función a invocar cuando el refresh falla o no hay refreshToken.
 * @returns {{ fetch: (url: string, options?: RequestInit) => Promise<Response> }}
 */
export function createApiClient(logoutCallback) {
  let isRefreshing = false;
  let refreshPromise = null;

  /**
   * Intenta renovar el accessToken usando el refreshToken almacenado.
   * Retorna true si el refresh fue exitoso, false en caso contrario.
   */
  async function attemptRefresh(refreshToken) {
    try {
      const response = await fetch(REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      updateTokens(data.token, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  return {
    /**
     * Realiza una petición HTTP adjuntando el Authorization header automáticamente.
     * Si recibe 401, intenta refresh y reintenta la petición original.
     * @param {string} url
     * @param {RequestInit} options
     * @returns {Promise<Response>}
     */
    async fetch(url, options = {}) {
      // 1. Obtener token de sesión y adjuntar Authorization header
      const session = getSession();
      const headers = new Headers(options.headers);

      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
      }

      // 2. Hacer fetch con el token actual
      const response = await fetch(url, { ...options, headers });

      // 3. Si no es 401, retornar la respuesta directamente
      if (response.status !== 401) return response;

      // 4. Es 401 — verificar si hay refreshToken disponible
      const currentSession = getSession();
      if (!currentSession?.refreshToken) {
        logoutCallback();
        return response;
      }

      // 5. Evitar múltiples refresh simultáneos
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = attemptRefresh(currentSession.refreshToken).finally(
          () => {
            isRefreshing = false;
          }
        );
      }

      const refreshSuccess = await refreshPromise;

      // 6. Si refresh falló, invocar logoutCallback
      if (!refreshSuccess) {
        logoutCallback();
        return response;
      }

      // 7. Refresh exitoso — reintentar petición original con nuevo token
      const updatedSession = getSession();
      const retryHeaders = new Headers(options.headers);

      if (updatedSession?.accessToken) {
        retryHeaders.set("Authorization", `Bearer ${updatedSession.accessToken}`);
      }

      return fetch(url, { ...options, headers: retryHeaders });
    },
  };
}
