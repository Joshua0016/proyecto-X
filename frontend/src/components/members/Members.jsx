export default function Members() {
    return (
        <>
            <h1>Members</h1>

            <div className=" mt-[25px] lg:w-[70%]  xl:w-[40%] w-[80%] mx-auto">


                <div className="w-[80%] mx-auto border-2 border-gray-200 rounded-[10px] mt-[20px] ">
                    <button className="w-[100%] cursor-pointer  xl:h-[35px]">Create members</button>
                </div>

                <div className="w-[80%] mx-auto mt-[20px] border-2 rounded-[10px] border-gray-200 text-center cursor-pointer">
                    <button className="w-[100%] cursor-pointer  xl:h-[35px]">Edit members</button>
                </div>



            </div>

        </>
    )
}