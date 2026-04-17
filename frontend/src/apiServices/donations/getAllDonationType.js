
import { getToken } from "../getToken";

export default async function getAllDonationType() {
    try {
        let response = await fetch("/api/DonationItemType", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            let result = await response.json();

            return result;
        }
        else {
            let result = await response.json()
            alert("Error al obtener los tipos de donaciones");
            console.log("Error ---- > " + result.message);
            return false;
        }
    } catch (error) {

        console.log("Error en el try catch getAllDonations -----> " + error);

    }

}