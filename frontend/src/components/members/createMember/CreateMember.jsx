import { useEffect, useState } from "react"
import createMember from "../../../apiServices/members/createMember";
import getAllMembers from "../../../apiServices/members/getAllMembers";
export default function CreateMember({ setView }) {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [birth, setBirth] = useState("");
    const [email, setEmail] = useState("");


    const handleButton = async () => {

        let dto = {
            Name: name,
            LastName: lastName,
            Telephon: phone,
            Email: email,
            UrlPhoto: "foto",
            Birth: birth

        }

        if (verification(dto)) {

            await createMember(dto);
        }
        else {
            console.log(dto)
            alert("Error en los campos... Por favor ingresar correctamente los valores");
        }
    }

    function verification(dto) {

        if (
            typeof name !== "string" || !/^[A-Za-z\s]+$/.test(name) ||
            typeof lastName !== "string" || !/^[A-Za-z\s]+$/.test(lastName) ||
            typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            console.log("Datos inválidos");
            return false;
        }


        if (!/^(809|829|849)\d{7}$/.test(phone)) {
            return false;
        }
        let isNull = Object.keys(dto).forEach((keys) => dto[keys] == undefined);

        if (isNull) {
            console.log("aquieeeeeeee")
            return false;
        }

        setName("");
        setLastName("");
        setBirth("");
        setEmail("");
        setPhone("");

        return true;
    }

    return (
        <>


            <div className="w-[90%] mx-auto flex flex-col items-center md:text-3xl ">
                <div className="">
                    <h2 className="text-gray-400 sm:text-[24px] lg:text-[32px]">Create member</h2>
                </div>

                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]" />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]"></input>
                <input type="tel" placeholder="Phone Number" maxLength={"10"} value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]"></input>
                <input type="tel" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]"></input>

                <div className="mt-[15px] flex flex-col items-center">
                    <label className="text-white xl:text-3xl">Date of birth</label>
                    <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] pl-2 border-2 border-gray-200 rounded-[5px]  md:h-12 lg:w-[225px]"></input>

                </div>

                <div className="w-[100%] mx-auto flex mt-[30px] justify-around md:text-3xl xl:w-[40%]">
                    <img src="/flecha.svg" className="w-[40px] sm:w-[50px] md:w-[60px] lg:w-[70px] cursor-pointer" alt="Back" onClick={() => setView(true)}></img>

                    <button className="rounded-[5px] cursor-pointer  text-white bg-blue-600 w-[70px] sm:w-[100px] md:w-[118px] lg:w-[120px]" onClick={handleButton}>Submit</button>
                </div>




            </div>


        </>
    )
}