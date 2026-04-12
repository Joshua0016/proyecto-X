import { getSession, updateTokens } from "./authService/tokenStorage";

const REFRESH_URL = "/api/User/refresh";
const nativeFetch = window.fetch.bind(window);

export function createApiClient(logoutCallback) {
  let isRefreshing = false;
  let refreshPromise = null;

  async function attemptRefresh(refreshToken) {
    try {
      const response = await nativeFetch(REFRESH_URL, {
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
    async fetch(url, options = {}) {
      const session = getSession();
      const headers = new Headers(options.headers);

      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
      }

      const response = await nativeFetch(url, { ...options, headers });

      if (response.status !== 401) return response;

      const currentSession = getSession();
      if (!currentSession?.refreshToken) {
        logoutCallback();
        return response;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = attemptRefresh(currentSession.refreshToken).finally(() => {
          isRefreshing = false;
        });
      }

      const refreshSuccess = await refreshPromise;

      if (!refreshSuccess) {
        logoutCallback();
        return response;
      }

      const updatedSession = getSession();
      const retryHeaders = new Headers(options.headers);

      if (updatedSession?.accessToken) {
        retryHeaders.set("Authorization", `Bearer ${updatedSession.accessToken}`);
      }

      return nativeFetch(url, { ...options, headers: retryHeaders });
    },
  };
}
