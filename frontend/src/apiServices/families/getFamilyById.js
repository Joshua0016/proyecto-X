import { getToken } from "../getToken";

export default async function getFamilyById(id) {
  try {
    const response = await fetch(`/api/Family/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Error al obtener familia por id:", error);
    return null;
  }
}