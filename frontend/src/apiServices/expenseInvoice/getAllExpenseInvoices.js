import { getToken } from "../getToken";

export default async function getAllExpenseInvoices() {
    try {
        let response = await fetch("/api/ExpenseInvoice", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.log("Error al obtener facturas ----> " + error);
        return [];
    }
}
