import { getSession } from "./authService/tokenstorage";

export function getToken() {
  return getSession()?.accessToken ?? null;
}
