export default async function deleteMember(id) {
    try {
        let response = await fetch(`/api/Member/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            let result = await response
            alert(`The member has been Delete`, result);

        }
        else {
            let result = await response
            alert("Error delete member");
            console.log(result);
        }
    } catch (error) {
        console.log("Error en el try catch", error);
    }
}