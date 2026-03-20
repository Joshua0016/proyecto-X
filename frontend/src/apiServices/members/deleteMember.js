export default async function deleteMember(id) {
    try {
        let response = await fetch(`/api/Member/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (response.ok) {
            let result = await response.text()
            return true;
        }
        else {
            let result = await response.text()
            alert("Error delete member");
            console.log(result);
            return false;
        }
    } catch (error) {
        console.log("Error en el try catch", error);
    }
}