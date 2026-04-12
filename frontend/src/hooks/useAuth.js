import { useContext } from "react";
import { authContext } from "@/apiServices/authService/authContext";


export const useAuth =() => {
    return useContext(authContext);
}