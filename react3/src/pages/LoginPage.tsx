import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login, user } = useAuth();
    const navigate = useNavigate();

    //Kontrollera om användare redan finns
    useEffect(() => {
        if(user) {
            navigate("/addpost");
        }
    }, [user])

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        setError("");

        try {

            await login({ username, password });
            navigate("/addpost");

        } catch (error) {
            setError("Inloggningen misslyckades. Kontrollera användarnamn och lösenord.");
        }
    }

    return (
        <div>
            <h1>Logga in</h1>

            <form onSubmit={handleSubmit}>
                {
                    error && (
                        <div>
                            {error}
                        </div>
                    )
                }

                <label htmlFor="username">Användarnamn:</label>
                <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="password">Lösenord:</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type='submit'>Logga in</button>
            </form>
        </div>
    )
}

export default LoginPage
