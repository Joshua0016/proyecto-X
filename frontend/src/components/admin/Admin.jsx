export default function Admin() {

    return (
        <>
            <div className="w-[80%] mx-auto">
                <h1 className="text-[20px]">User managment</h1>
            </div>

            <div className="flex flex-col gap-2 mt-[25px]">
                <div className="w-[80%] mx-auto border-2 rounded-[5px] border-gray-200 text-center">
                    <button>Create user</button>
                </div>
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