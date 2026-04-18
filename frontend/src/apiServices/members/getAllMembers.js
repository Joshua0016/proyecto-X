import { getToken } from "../getToken";

export default async function getAllMembers() {

    try {
        const token = getToken();
        let response = await fetch("/api/Member/GetAll", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            let result = await response.json();
            return result;
        }
        else {
            let result = await response.json();
            console.log("Error al obtener los miembros", result.message);
        }

    } catch (error) {

        console.log("Error en el try catch ", error);

    }


}