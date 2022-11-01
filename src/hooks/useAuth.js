import { useContext } from "react";
import AuthContext  from "../context/loginContext";

const useAuth = ()=> useContext(AuthContext)

export default useAuth;

