import { getToken } from "../getToken";

export default async function createMember(dto) {

    try {

        let response = await fetch("/api/Member/Create", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(dto)
        })
        if (response.ok) {

            return true;
        }
        else {
            let result = await response.json();
            alert("No se ha podido crear al miembro");
            console.log(result)
            return false;
        }
    } catch (error) {

        console.log("Error en el try catch ", error);

    }

}