import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import paloma from "./assets/paloma.png"
import login from "../../api/login"
export default function Login() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [textbutton, setTextButton] = useState("Sign up")
    //check hook
    const [rememberMe, setRemember] = useState(false);

    useEffect(() => {
        const rememberMe = localStorage.getItem("rememberUser");
        localStorage.setItem("loggedIn", false);

        if (rememberMe != null) {
            setUserName(rememberMe);
            setRemember(true);
        }
    }, [])



    const handdlebutton = async () => {
        setTextButton("loading...");

        try {
            let succes = await login(userName, password);
            if (succes) {
                if (rememberMe) {
                    localStorage.setItem("rememberUser", userName);
                }
                else {
                    localStorage.removeItem("rememberUser");
                }
                setTextButton("success full");
                localStorage.setItem("loggedIn", true); //asegurar que el usuario este logeado
                navigate("/home");
            } else {
                setTextButton("Login failed");
            }

        } catch (error) {
            alert("Error... ", error);
        }
    }

    return (
        <>
            {/*Titulos*/}
            <div className="border-2 border-gray-200 w-[80%] mx-auto h-[500px] mt-[200px] rounded-[5px] bg-white md:h-[600px] lg:w-[70%]  xl:w-[40%]">
                <div className="w-[80%] mx-auto mt-[25px] ">
                    <p className="text-gray-400 md:text-[22px]">Please enter your details</p>
                    <h1 className="text-[25px] md:text-[40px]">Welcome back</h1>
                </div>

                {/*inputs userName password*/}
                <div className="w-[80%] mx-auto mt-[25px]">
                    <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-[100%] h-8 px-3 border border-gray-300 rounded-[5px] md:h-12"></input>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-[30px] w-[100%] h-8 px-3 border border-gray-300 rounded-[5px] md:h-12"></input>

                </div>
                {/*input check and link PENDIENTE REALIZAR IMPLEMENTACIONES LINK*/}
                <div className="w-[80%] mx-auto flex mt-[10px] relative">

                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRemember(e.target.checked)}></input><p className="px-1 md:text-[20px]">Remember user</p>
                    {/*<a className="absolute right-0 underline text-blue-600 md:text-[20px]">Forgot password</a>*/}
                </div>
                {/*button*/}
                <div className="w-[80%] mx-auto">
                    <button onClick={handdlebutton} className="w-[100%] h-[40px] mt-[50px] bg-blue-500 rounded-[4px] text-white cursor-pointer">{textbutton}</button>
                </div>
                {/*logo*/}
                <div className="w-[80%] mx-auto">
                    <img src={paloma} className="w-[180px] mx-auto"></img>
                </div>
                <div className="w-[80%] mx-auto">

                </div>


            </div>
        </>
    )
}