import { getToken } from "../getToken";

export default async function getAllAccounts() {
    try {
        let response = await fetch("/api/LedgerAccount/GetAll", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        })
        if (response.ok) {
            let result = response.json();
            return result;
        }
        else {
            let result = response.json()
            alert("Error al intentar obtener las cuentas");
            console.log(result)
        }
    } catch (error) {
        console.log("Error try catch getAllAccount apiservices ---> " + error);

    }
} 