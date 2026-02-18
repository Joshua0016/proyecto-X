import { useEffect, useState } from "react"
import getAllMembers from "../../../apiServices/members/getAllMembers";

export default function Search({ setSearch }) {
    const [members, setMembers] = useState([]);
    useEffect(() => {
        async function getMembers() {
            let data = await getAllMembers();
            setMembers(data);
        }
        getMembers();
    }, [])
    console.log(members);

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-[5px]">
                <div className="w-full h-full flex">
                    <div className="bg-gray-200 mx-auto my-auto w-full rounded-2xl p-8">

                        <ul className="mb-10">
                            {members.map((element) => <li key={element.idMiembro} className="cursor-pointer border-2 rounded-3xl p-3 m-2">{`${element.nombre} ${element.apellido}`}</li>)}
                        </ul>
                        <img src="/flecha.svg" className="w-14" onClick={() => setSearch(false)}></img>

                    </div>
                </div>
            </div>
        </>
    )
}