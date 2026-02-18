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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-[5px]">
                <div className="w-full h-full flex flex-col">
                    <div className="bg-gray-200 mx-auto my-auto rounded-2xl p-8 max-h-[400px] overflow-y-auto">

                        <ul className="mb-10">
                            {members.map((element) => <li key={element.idMiembro} className="cursor-pointer m-2 border-2 rounded-3xl p-3" onClick={() => handleButton(element)}>{`${element.nombre} ${element.apellido}`}</li>)}
                        </ul>


                    </div>
                    <div className="p-3 bg-gray-200 rounded-2xl w-[30%]">
                        <img src="/flecha.svg" className="w-14 mx-auto" onClick={() => setSearch(false)}></img>
                    </div>
                </div>
            </div>
        </>
    )
}