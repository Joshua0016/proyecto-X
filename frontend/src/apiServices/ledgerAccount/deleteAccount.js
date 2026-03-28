export default async function deleteAccount(data) {
    try {
        let response = await fetch(`/api/LedgerAccount/${data}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (response.ok) {
            return true;
        }
        else {
            let result = response.json();
            alert("Error al intentar la eliminación");
            console.log("Error al intentar eliminar ---> " + result)
        }
    } catch (error) {
        console.log("Error try catch apiservice ----->" + error)
    }
}