export default async function updateMember(id, dto) {
    try {
        let response = await fetch(`/api/Member/${id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dto)
        })

        if (response.ok) {
            let result = await response
            alert(`The member has been Update`);

        }
        else {
            let result = await response
            alert("Error updating member");
            console.log(result);
        }
    } catch (error) {
        console.log("Error en el try catch", error);
    }
}