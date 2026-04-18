import { getToken } from "../getToken";

// src/apiServices/events/deleteEvent.js
export default async function deleteEvent(id) {
  try {
    const response = await fetch(`/api/Event/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      let message = "Error al eliminar el evento";
      try {
        const error = JSON.parse(text);
        message = error.message || message;
      } catch {
        if (text) message = text;
      }
      // 422 = tiene donaciones, el componente maneja el flujo con diálogo
      if (response.status !== 422) alert(message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    alert("Error de conexión");
    return false;
  }
}