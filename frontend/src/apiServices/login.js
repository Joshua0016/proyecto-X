//Pendiente autenticacion del login
export default async function login(username, password) {

    try {
        let request = {
            Email: username,
            Password: password
        }
        let response = await fetch("/api/User/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            let response = await response.json();
            return response;
        }
        else {
            console.log("error al enviar la peticon");
            return false;
        }

    } catch (error) {

        console.log("Error en el try catch ", error);

    }

    return true;
}