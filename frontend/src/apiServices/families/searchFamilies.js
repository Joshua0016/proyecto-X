export default async function searchFamilies(query) {
  try {
    const url = `/api/Family/search?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
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
    console.error("Error en búsqueda de familias:", error);
    return [];
  }
}