import { useState } from "react"

export default function NewUser({ setNewUser, sethideContent }) {
    const [text, setText] = useState("");
    const [password, setPassword] = useState("")

    const handleButton = () => {
        setNewUser(false);
        sethideContent(false);
    }

    return (
        <>
            <div className="text-center">
                <h2 className="">Create user</h2>
            </div>

            <div>
                <input type="text" placeholder="Name user" value={text} onChange={(e) => setText(e.target.value)} className="pl-2 border-2 border-gray-200 rounded-[5px]"></input>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 pl-2 border-2 border-gray-200 rounded-[5px]"></input>

            </div>

            <div className="">
                <button className="bg-blue-600 text-white rounded-[5px] w-[70px]" onClick={handleButton}>Submit</button>
            </div>

        </>
    )
}