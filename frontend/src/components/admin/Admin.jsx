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
            <div className="w-[80%] mx-auto">
                <h1 className="text-[20px]">User managment</h1>
            </div>


            <div className="flex flex-col gap-2 mt-[25px]">

                {!hideContent && (<div className="w-[80%] mx-auto border-2 rounded-[5px] border-gray-200 text-center">
                    <button onClick={buttonCreate}>Create user</button>
                </div>)}

                {newUser ? <NewUser setNewUser={setNewUser} sethideContent={sethideContent}></NewUser> : ""}

                {/*
                <div className="w-[80%] mx-auto border-2 rounded-[5px] border-gray-200 text-center">
                    <button>Delete user</button>
                </div>
                <div className="w-[80%] mx-auto border-2 rounded-[5px] border-gray-200 text-center">
                    <button>Update user</button>
                </div>*/}
            </div>


        </>
    )
}