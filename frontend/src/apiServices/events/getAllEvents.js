import { getToken } from "../getToken";

// src/apiServices/events/getAllEvents.js
export default async function getAllEvents() {
  try {
    const token = getToken(); 
    const response = await fetch("/api/Event", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error(error.message || "Error al obtener eventos");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}