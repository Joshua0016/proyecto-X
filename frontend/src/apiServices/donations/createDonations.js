export default async function createDonation(params) {
    try {
        let response = await fetch("/api/Donation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(params)
        });
        if (response.ok) {
            let result = await response.json();
            alert(result.message);
            return true;
        }
        else {
            let result = await response.json();
            console.log("Error al enviar los datos ----> " + result);
            alert("La donación no pudo ser completada");
            return false;

        }
    } catch (error) {
        console.log("Errror try catch ------> " + error);
    }
}