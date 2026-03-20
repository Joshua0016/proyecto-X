export default async function updateMember(id, dto) {
    try {
        let response = await fetch(`/api/Member/${id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(dto)
        })

        if (response.ok) {
            let result = await response.text()
            alert(`The member has been ${result}`);
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