export default async function createMember(dto) {

    try {
        console.log(dto);
        let response = await fetch("/api/Member/Create", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dto)
        })
        if (response.ok) {
            let result = await response.json();
            alert("Member has been create");
        }
        else {
            let result = await response.json();
            alert("Create of member failure");
            console.log(result);
        }
    } catch (error) {

        console.log("Error en el try catch ", error);

    }

}