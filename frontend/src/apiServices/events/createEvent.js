import { getToken } from "../getToken";

// src/apiServices/events/createEvent.js
export default async function createEvent(dto) {
  try {
    const response = await fetch("/api/Event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(dto)
    });

    if (!response.ok) {
      const text = await response.text();
      let message = "Error al crear el evento";
      try {
        const error = JSON.parse(text);
        message = error.message || message;
      } catch {
        if (text) message = text;
      }
      console.error(message);
      alert(message);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Error de conexión");
    return null;
  }
}