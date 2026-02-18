
import { useState } from "react";
import Search from "./Search";
import deleteMember from "../../../apiServices/members/deleteMember";
import updateMember from "../../../apiServices/members/updateMember";

export default function EditMember({ setView }) {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [birth, setBirth] = useState("");
    const [email, setEmail] = useState("");
    const [memberId, setMemberId] = useState();
    const [deleteCheck, setDelete] = useState(false);
    const [updateCheck, setUpdate] = useState(false);
    const [search, setSearch] = useState(false);

    const handleButton = async () => {


        if (deleteCheck) {
            await deleteMember(memberId);
        }
        else if (updateCheck) {
            await updateMember(memberId);
        }
        else {
            alert("Error...");
        }

        setName("");
        setLastName("");
        setPhone("");
        setBirth("");
        setEmail("");
        setMemberId(null);

    }


    return (
        <>
            <div className="w-[80%] mx-auto text-center ">
                <div className="w-[80%] mx-auto text-gray-400">
                    <h2>Edit Member</h2>
                </div>
                {/* Search event */}
                <div className="w-[80%] xl:w-[30%] mx-auto cursor-pointer" onClick={() => setSearch(!search)}>
                    <img src="/search.png" className="w-8"></img>
                </div>


                {/* Search Component */}

                {search && <Search setSearch={setSearch} setName={setName} setLastName={setLastName} setPhone={setPhone} setEmail={setEmail} setBirth={setBirth} setMemberId={setMemberId}></Search>}

                {/* data member... inputs */}
                <div className=" flex flex-col items-center ">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]" />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]"></input>
                    <input type="tel" placeholder="Phone Number" maxLength={"10"} value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]"></input>
                    <input type="tel" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] mt-[15px] pl-2 border-2 border-gray-200 rounded-[5px] w-[80%] md:h-12 xl:w-[20%]"></input>

                </div>
                <div className="mt-[15px] flex flex-col items-center">
                    <label className="text-white xl:text-3xl">Date of birth</label>
                    <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="bg-[#3C3C3C] text-[#D4D4D4] placeholder-[#808080] pl-2 border-2 border-gray-200 rounded-[5px]  md:h-12 lg:w-[225px]"></input>

                </div>
                {/* checkBox update and delete */}
                <div className="w-[80%] mx-auto m-2 flex flex-row justify-around">
                    <div>
                        <input type="checkbox" disabled={deleteCheck} checked={updateCheck} onChange={((e) => setUpdate(e.target.checked))}></input>
                        <label className="text-gray-200 ml-2">Update</label>
                    </div>
                    <div>

                        <input type="checkbox" disabled={updateCheck} checked={deleteCheck} onChange={((e) => setDelete(e.target.checked))}></input>
                        <label className="text-gray-200 ml-2">Delete</label>
                    </div>
                </div>
                {/* Button event */}
                <div className="w-[100%] mx-auto flex mt-[30px] justify-around md:text-3xl xl:w-[40%]">
                    <img src="/flecha.svg" className="w-[40px] sm:w-[50px] md:w-[60px] lg:w-[70px] cursor-pointer" alt="Back" onClick={() => setView(true)}></img>

                    <button className="rounded-[5px] cursor-pointer  text-white bg-blue-600 w-[70px] sm:w-[100px] md:w-[118px] lg:w-[120px]" onClick={handleButton}>Submit</button>
                </div>

            </div>

        </>
    )
}