import React, { useState } from 'react'

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
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
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>

                <button type='submit'>Logga in</button>
            </form>
        </div>
    )
}

export default LoginPage
