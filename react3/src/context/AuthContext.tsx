import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginCredentials, AuthResponse, AuthContextType } from "../types/auth.types"

//Skapa context
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    //Sparar inloggad användare i state
    const [user, setUser] = useState<User | null>(null);

    //Tar emot användarens inloggningsuppgifter
    const login = async (credentials: LoginCredentials) => {

        try {
            //POST för inloggning
            const res = await fetch("https://blog-api-bzd2.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })

            if (!res.ok) {
                throw new Error("Inloggningen misslyckades");
            }

            //Tolkar svar som AuthRespons
            const data = await res.json() as AuthResponse;

            //Sparar JWT i localstorage
            localStorage.setItem("token", data.token);
            setUser(data.user);


        } catch (error) {
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

    //Validera token från localStorage
    const checkToken = async () => {
        const token = localStorage.getItem("token");

        //Avbryter om token saknas
        if(!token) {
            return;
        }

        try {
            //Skickar token till backend för validering
            const res = await fetch("https://blog-api-bzd2.onrender.com/api/auth/validate", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });

            //Om ok, uppdateras user state
            if(res.ok) {
                const data = await res.json();
                setUser(data.user);
            }


        } catch(error) {
            //Vid fel tas token bort
            localStorage.removeItem("token")
            setUser(null);

        }
    }

    //Håller användaren inloggad vid siduppdatering
    useEffect(() => {
        checkToken();
    }, [])

    //Gör user, login oh logout tillgängliga globalt i hela appen
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

//Hook som förenklar användningen av AuthProvider
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth måste användas inom en AuthProvider");

    }

    return context;
}