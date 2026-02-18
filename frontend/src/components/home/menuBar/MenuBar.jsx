import { Link } from "react-router-dom"
export default function MenuBar({ setView }) {

    return (
        <>
            <div className="fixed inset-0 mt-10 bg-black/70 backdrop-blur-[5px] p-3" onClick={() => setView(false)}>
                <div className="text-2xl md:text-3xl lg:text-4xl text-white flex flex-col m-3 gap-3">
                    <h2 className="text-gray-400 text-[14px]">Menu</h2>
                    <Link to={"members"} className="">Members</Link>
                    <Link to={"finance"} className="">Finance</Link>
                    <Link to={"events"} className="">Events</Link>
                    <Link to={"report"} className="">Report</Link>

                </div>
            </div>
        </>
    )
}