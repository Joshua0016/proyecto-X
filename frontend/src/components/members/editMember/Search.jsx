import { useEffect, useState } from "react"
import getAllMembers from "../../../apiServices/members/getAllMembers";
import CreateMember from "../createMember/CreateMember";
import EditMember from "./EditMember";

export default function Search({ setSearch, setName, setLastName, setPhone, setEmail, setBirth, setMemberId }) {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        async function getMembers() {
            let data = await getAllMembers();
            setMembers(data);
        }
        getMembers();
    }, [])
    console.log(members);

    let handleButton = (element) => {
        setName(element.nombre);
        setLastName(element.apellido);
        setPhone(element.telefono);
        setEmail(element.correo);
        setBirth(element.fechaNacimiento);
        setMemberId(element.idMiembro);
        setSearch(false);
    }

    return (
        <>
            <div className="fixed inset-0 w-full flex flex-col h-full  bg-black/70 backdrop-blur-[5px]">
                <div className=" gap-5 w-[80%] xl:w-[40%] mx-auto my-auto max-h-[400px]">
                    <div className="bg-gray-200  rounded-2xl p-8 m-2 overflow-y-auto">

                        <ul className="mb-10">
                            {members.map((element) => <li key={element.idMiembro} className="cursor-pointer m-2 border-2  rounded-3xl p-3" onClick={() => handleButton(element)}>{`${element.nombre} ${element.apellido}`}</li>)}
                        </ul>


                    </div>
                    <div className="p-2 bg-gray-200 rounded-2xl w-[20%] cursor-pointer">
                        <img src="/flecha.svg" className="w-10 mx-auto" onClick={() => setSearch(false)}></img>
                    </div>
                </div>
            </div>
        </>
    )
}