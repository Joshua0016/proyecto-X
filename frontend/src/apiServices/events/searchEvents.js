import { getToken } from "../getToken";

// src/apiServices/events/searchEvents.js
export default async function searchEvents(query) {
  try {
    const url = `/api/Event/search?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error.message);
      return [];
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error en búsqueda de eventos:", error);
    return [];
  }
}