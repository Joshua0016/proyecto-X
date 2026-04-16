import { getToken } from "../getToken";

export default async function createExpenseInvoice(params) {
    try {
        let response = await fetch("/api/ExpenseInvoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(params)
        });
        if (response.ok) {
            let result = await response.json();
            alert(result.message);
            return true;
        } else {
            let result = await response.json();
            console.log("Error al guardar la factura ----> " + result);
            alert("La factura no pudo ser registrada");
            return false;
        }
    } catch (error) {
        console.log("Error try catch ------> " + error);
    }
}
