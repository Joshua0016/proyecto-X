import { useState } from "react"
import CreateMember from "./createMember/CreateMember";

export default function Members() {
    const [view, setViwe] = useState(true);


    return (
        <>
            <div className="mt-[200px] md:">
                <h1 className="text-white text-[28px] text-center  lg:text-[48px] ">Members</h1>




                <div style={{ backgroundColor: "#1A1A1A" }} className=" rounded-2xl h-[150px] sm:text-2xl ">



                    {view && (
                        <div className="flex flex-col w-full h-full justify-around sm:w-[70%] sm:mx-auto 2xl:w-[40%]">
                            <div style={{ backgroundColor: "#007ACC" }} className="w-[80%] mx-auto border-2 border-gray-200 rounded-[10px] ">
                                <button className=" w-[100%] cursor-pointer  xl:h-[35px]" onClick={() => setViwe(false)}>Create</button>
                            </div>
                            <div style={{ backgroundColor: "#007ACC" }} className=" w-[80%] mx-auto border-2 border-gray-200 rounded-[10px]  border-gray-200 text-center cursor-pointer">
                                <button className="w-[100%] cursor-pointer  xl:h-[35px]">Edit</button>
                            </div>
                        </div>
                    )}

                    {!view && <CreateMember setView={setViwe}></CreateMember>}

                </div>

            </div>


        </>
    )
}