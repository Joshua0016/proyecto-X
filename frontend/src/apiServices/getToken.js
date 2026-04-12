import { getSession } from "./authService/tokenStorage";

export function getToken() {
  return getSession()?.accessToken ?? null;
}
