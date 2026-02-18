import { useEffect, useState } from "react"
import getAllMembers from "../../../apiServices/members/getAllMembers";

export default function Search({ setSearch }) {
    const [members, setMembers] = useState();
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
                    <div className="bg-gray-200 mx-auto my-auto rounded-2xl p-8">

                        fadfadfasdf
                        <div onClick={() => setSearch(false)}>COME BACK</div>

                    </div>
                </div>
            </div>
        </>
    )
}