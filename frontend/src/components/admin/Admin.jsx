import { useState } from "react"
import { useNavigate } from "react-router-dom";
import NewUser from "./createUser/NewUser";

export default function Admin() {
    const [newUser, setNewUser] = useState(false);
    const [hideContent, sethideContent] = useState(false);

    const buttonCreate = () => {
        sethideContent(true);
        setNewUser(true);
    }
    return (
        <>
            <div className="w-[80%] mx-auto ">
                <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[32px]">User managment</h1>
            </div>


            <div className=" mt-[25px] lg:w-[70%]  xl:w-[40%] w-[80%] mx-auto">

                {!hideContent && (<div className="w-[80%] mx-auto mt-[20px] border-2 rounded-[10px] border-gray-200 text-center cursor-pointer">
                    <button onClick={buttonCreate} className="w-[100%] cursor-pointer  xl:h-[35px]">Create user</button>
                </div>)}

                {newUser ? <NewUser setNewUser={setNewUser} sethideContent={sethideContent}></NewUser> : ""}

                {!hideContent ? <div className="w-[80%] mx-auto mt-[20px] border-2 rounded-[10px] border-gray-200 text-center">
                    <button className="w-[100%] cursor-pointer  xl:h-[35px]">Edit users</button>
                </div> : ""}



            </div>


        </>
    )
}