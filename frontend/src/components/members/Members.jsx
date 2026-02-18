import { useState } from "react"
import CreateMember from "./createMember/CreateMember";
import EditMember from "./editMember/EditMember";

export default function Members() {
    const [viewCreate, setViewCreate] = useState(true);
    const [viewEdit, setViewEdit] = useState(true);


    return (
        <>
            <div className="mt-[100px] mb-[50px]">
                <h1 className="text-white text-[28px] text-center lg:text-[48px]">Members</h1>

                <div className="bg-[#1A1A1A] rounded-2xl p-8 sm:text-2xl ">



                    {(viewCreate && viewEdit) && (
                        <div className="flex flex-col gap-10 w-full h-full justify-around sm:w-[70%] sm:mx-auto 2xl:w-[40%]">
                            <div style={{ backgroundColor: "#007ACC" }} className="w-[80%] mx-auto border-2 border-gray-200 rounded-[10px] ">
                                <button className=" w-[100%] cursor-pointer  xl:h-[35px]" onClick={() => setViewCreate(!viewCreate)}>Create</button>
                            </div>
                            <div style={{ backgroundColor: "#007ACC" }} className=" w-[80%] mx-auto border-2 border-gray-200 rounded-[10px]  border-gray-200 text-center cursor-pointer">
                                <button className="w-[100%] cursor-pointer  xl:h-[35px]" onClick={() => setViewEdit(!viewEdit)}>Edit</button>
                            </div>
                        </div>
                    )}

                    {!viewCreate && <CreateMember setView={setViewCreate}></CreateMember>}
                    {!viewEdit && <EditMember setView={setViewEdit}></EditMember>}

                </div>

            </div>


        </>
    )
}