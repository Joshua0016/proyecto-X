import { getToken } from "../getToken";

export default async function updateFamily(id, dto) {
  try {
    const response = await fetch(`/api/Family/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(dto)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error.message);
      alert(error.message || "Error al actualizar familia");
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    alert("Error de conexión");
    return false;
  }
}