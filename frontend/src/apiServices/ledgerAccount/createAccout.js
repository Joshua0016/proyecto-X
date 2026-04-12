import { getToken } from "../getToken";

export default async function createAccount(data) {
    try {
        let response = await fetch("/api/LedgerAccount/Create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            let result = await response.json();
            alert(result.message)
            return true;
        }
        else {
            let result = await response.json();

            alert(`${result.message}`)

        }

    } catch (error) {
        console.log("Error en el try catch ---> " + error);
    }
}