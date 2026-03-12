export default async function createMember(dto) {

    try {
        console.log(dto);
        console.log("Hola bb")
        let response = await fetch("/api/Member/Create", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(dto)
        })
        if (response.ok) {
            let result = await response.json();
            alert(`Member has been create ${result.message}`);
            return true;
        }
        else {
            let result = await response.json();
            alert("Create of member failure");
            console.log(result.message);
            return false;
        }
    } catch (error) {

        console.log("Error en el try catch ", error);

    }

}