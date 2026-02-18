export default async function updateMember(id) {
    try {
        let response = await fetch(`/api/Members/${id}`, {
            method: "POST"
        });
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