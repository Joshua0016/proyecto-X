//Pendiente autenticacion del login
export default async function getAllMembers() {

    try {

        let response = await fetch("/api/Member/GetAll", {
            method: "GET",
        });

        if (response.ok) {
            let result = await response.json();
            return result;
        }
        else {
            let result = await response.json();
            console.log("Error al obtener los miembros", result);
        }

    } catch (error) {

        console.log("Error en el try catch ", error);

    }


}