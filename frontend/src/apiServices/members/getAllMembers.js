//Pendiente autenticacion del login
export default async function getAllMembers() {

    try {

        let response = await fetch("/api/Members/GetAll", {
            method: "GET",
        });

        if (response.ok) {
            let result = await response.json();
            console.log(result);
        }
        else {

            console.log("Error")
        }

    } catch (error) {

        console.log("Error en el try catch ", error);

    }

    return true;
}