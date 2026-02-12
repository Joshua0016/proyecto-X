import { useState } from "react"


export default function NewUser({ setNewUser, sethideContent }) {
    const [text, setText] = useState("");
    const [password, setPassword] = useState("")


    const handleButton = () => {
        reset();
        alert("Realizar conexion backend pendiente");
    }

    function reset() {
        setNewUser(false);
        sethideContent(false);
    }

    return (
        <>
            <div className="text-center">
                <h2 className="sm:text-[24px] lg:text-[28px]">Create user</h2>
            </div>

            <div className="w-[80%] mx-auto">
                <input type="text" placeholder="Name user" value={text} onChange={(e) => setText(e.target.value)} className="pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>

            </div>

            <div className="w-[80%] mx-auto flex justify-around mt-[15px]">

                <div className="cursor-pointer" onClick={() => reset()}>

                    <img src="/flecha.svg" alt="volver" className="w-[32px] pr-2 inline cursor-pointer md:w-[48px]"></img>

                    <p className="inline md:text-[24px]">Back</p>

                </div>


                <button disabled={!text || !password} className={`${text && password ? "bg-blue-600 text-white rounded-[5px] cursor-pointer w-[80px] md:h-[42px] md:text-[24px]" : "bg-blue-200 text-white rounded-[5px] w-[80px] md:h-[42px] md:text-[24px]"}`} onClick={handleButton}>Submit</button>

            </div>

        </>
    )
}