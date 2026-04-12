import { getToken } from "../getToken";

export default async function deleteFamily(id) {
  try {
    const response = await fetch(`/api/Family/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error.message);
      alert(error.message || "Error al eliminar familia");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar familia:", error);
    alert("Error de conexión");
    return false;
  }
}