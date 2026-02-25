import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import type {User, LoginCredentials, AuthResponse, AuthContextType } from "../types/auth.types"

//Skapa context
const AuthContext = createContext < AuthContextType | null >(null);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {

    const [user, setUser] = useState< User | null >(null);

    //Logga in användare
    const login = async (credentials: LoginCredentials) => {
        
        try{
            const res = await fetch("https://blog-api-bzd2.onrender.com/api/login", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })

            if(!res.ok) {
                throw new Error("Inloggningen misslyckades");

                const data = await res.json() as AuthResponse;

                localStorage.setItem("token", data.token);
                setUser(data.user);
            }

        } catch(error) {
            throw error;
        }
    }

    //Logga ut användare
    const logout = () => {
        //Tar bort token
        localStorage.removeItem("token");

        //Sätter användaren till null
        setUser(null);
    }

    return (
        <AuthContext.Provider value= {{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("useAuth måste användas inom en AuthProvider");
        
    }

    return context;
}