export default async function createFamily(dto) {
  try {
    const response = await fetch("/api/Family", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(dto)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error.message);
      alert(error.message || "Error al crear familia");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Error de conexión");
    return null;
  }
}