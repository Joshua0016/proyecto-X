import { getToken } from "../getToken";

// src/apiServices/events/updateEvent.js
export default async function updateEvent(id, dto) {
  try {
    const response = await fetch(`/api/Event/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(dto)
    });

    if (!response.ok) {
      const text = await response.text();
      let message = "Error al actualizar el evento";
      try {
        const error = JSON.parse(text);
        message = error.message || message;
      } catch {
        if (text) message = text;
      }
      console.error(message);
      alert(message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Error de conexión");
    return false;
  }
}