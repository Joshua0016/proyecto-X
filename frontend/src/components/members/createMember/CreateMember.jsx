import { useState } from "react"

export default function CreateMember({ setView }) {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [birth, setBirth] = useState("");

    const handleButton = () => {

        // Member = {
        //     Nombre: name,
        //     apellido: lastName,
        //     foto: null,
        //     fecha_nacimiento: birth,
        //     telefono: phone,

        // }
        verification();
    }

    function verification() {
        console.log(phone.length)
        if (!isNaN(name || lastName) || isNaN(phone) || phone.length < 10) {
            alert("Invalid values in the fields");
        }

    }

    return (
        <>
            <div className="border-2  border-black rounded-[5px] p-[5px]">
                <div className="text-center">
                    <h2 className="sm:text-[24px] lg:text-[28px]">Create member</h2>
                </div>
                <div className="w-[90%] mx-auto">

                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>
                    <input type="tel" placeholder="Phone Number" maxLength={"10"} value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>

                    <div className="mt-[15px] flex-col">
                        <label>Date of birth</label>
                        <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12"></input>

                    </div>

                    <div className="w-[100%] mx-auto flex mt-[30px] justify-around ">
                        <img src="/flecha.svg" className="w-[40px]" alt="Back" onClick={() => setView(true)}></img>

                        <button className="rounded-[5px] cursor-pointer  text-white bg-blue-600 w-[70px]" onClick={handleButton}>Submit</button>
                    </div>

                </div>

            </div>
        </>
    )
}