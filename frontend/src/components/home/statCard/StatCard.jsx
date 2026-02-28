import Paper from "@mui/material/Paper";

export default function StatCard({ title, icon, value, color }) {

    return (
        <>
            <Paper elevation={3} sx={{ transition: "0.3s", "&:hover": { transform: "translateY(-5px)", cursor: "pointer" } }} className="p-10 text-2xl relative" >
                {/* linea decorativa */}
                <div className="absolute left-0 top-0 h-[100%] w-[5px]" style={{ backgroundColor: `${color}` }}></div>

                {/* title and icon */}
                <div className="flex justify-between">
                    <div className="">
                        <h2>{title}</h2>
                        <h1 className=" md:text-3xl lg:text-4xl">{value}</h1>
                    </div>
                    {icon}
                </div>


            </Paper>
        </>
    )
}