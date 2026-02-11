import { useState } from "react"

export default function NewUser({ setNewUser, sethideContent }) {
    const [text, setText] = useState("");
    const [password, setPassword] = useState("")

    const handleButton = () => {
        setNewUser(false);
        sethideContent(false);
        alert("Realizar conexion backend pendiente");
    }

    return (
        <>
            <div className="text-center">
                <h2 className="sm:text-[24px] lg:text-[28px]">Create user</h2>
            </div>

            <div className="w-[80%] mx-auto">
                <input type="text" placeholder="Name user" value={text} onChange={(e) => setText(e.target.value)} className="pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>

            </div>

            <div className="">
                <button className="bg-blue-600 text-white rounded-[5px] cursor-pointer w-[85px] md:h-[42px]" onClick={handleButton}>Submit</button>
            </div>

        </>
    )
}