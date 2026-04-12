import { getToken } from "../getToken";

export default async function updateMember(id, dto) {
    try {
        let response = await fetch(`/api/Member/${id}`, {
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
            let result = await response.text()
            alert("Error updating member");
            console.log(result);
            return false;
        }
    } catch (error) {
        console.log("Error en el try catch", error);
    }
}