// src/apiServices/events/getEventById.js
export default async function getEventById(id) {
  try {
    const response = await fetch(`/api/Event/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Error al obtener evento por id:", error);
    return null;
  }
}