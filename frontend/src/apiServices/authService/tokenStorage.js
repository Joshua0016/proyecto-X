const SESSION_KEY = "app_session";

/**
 * Almacena la sesión completa como JSON serializado en localStorage.
 * @param {{ accessToken: string, refreshToken: string|null, email: string, userId: string, name: string, rol: string }} sessionData
 */
export function setSession(sessionData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

/**
 * Retorna el objeto de sesión parseado desde localStorage, o null si no existe o es inválido.
 * @returns {{ accessToken: string, refreshToken: string|null, email: string, userId: string, name: string, rol: string } | null}
 */
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Elimina la clave de sesión de localStorage.
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Actualiza solo los tokens (accessToken y refreshToken) en la sesión existente.
 * Si no existe sesión, no hace nada.
 * @param {string} accessToken
 * @param {string|null} refreshToken
 */
export function updateTokens(accessToken, refreshToken) {
  const session = getSession();
  if (!session) return;
  session.accessToken = accessToken;
  session.refreshToken = refreshToken;
  setSession(session);
}
