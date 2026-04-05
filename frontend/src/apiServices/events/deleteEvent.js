// src/apiServices/events/deleteEvent.js
export default async function deleteEvent(id) {
  try {
    const response = await fetch(`/api/Event/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error.message);
      alert(error.message || "Error al eliminar el evento");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    alert("Error de conexión");
    return false;
  }
}