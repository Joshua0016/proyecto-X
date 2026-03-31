export default async function journalEntry(data) {
    try {
        let response = await fetch("/api/JournalEntry/Create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            let result = await response.json();
            alert(`${result.message}`);
            return true;
        }
        else {
            let result = await response.json();
            alert(`${result.message}`);
            return false;
        }
    } catch (error) {
        console.log("Error try catch jouranEntry -----> " + error);
    }

}