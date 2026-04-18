import { getToken } from "../getToken";

export default async function getAllFamilies() {
  try {
    const token = getToken(); 
    const response = await fetch("/api/Family", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error(error.message || "Error al obtener familias");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener familias:", error);
    return [];
  }
}