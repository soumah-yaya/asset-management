import { createContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   
    const signin = (token, callback) => {
        localStorage.setItem('token', token)
        
        callback()
    }

    const signout = (callback) => {
        localStorage.removeItem('token')
       
        callback()
    }

    const isAuth = () => localStorage.getItem('token') !== null 

    const value = { signin, signout, isAuth }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
