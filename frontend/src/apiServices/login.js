
export default async function login(username, password) {

    try {
        let request = {
            Email: username,
            Password: password
        }
        let response = await fetch("/api/User/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            let result = await response.json();
            localStorage.setItem("token", result.token);
            localStorage.setItem("email", result.email);
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("name", result.name)

            console.log(result)
            return true;
        }
        else {

            return false;
        }

    } catch (error) {

        console.log("Error en el try catch ", error);

    }


}