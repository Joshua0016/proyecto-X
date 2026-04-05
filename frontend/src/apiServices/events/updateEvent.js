// src/apiServices/events/updateEvent.js
export default async function updateEvent(id, dto) {
  try {
    const response = await fetch(`/api/Event/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(dto)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error.message);
      alert(error.message || "Error al actualizar el evento");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Error de conexión");
    return false;
  }
}