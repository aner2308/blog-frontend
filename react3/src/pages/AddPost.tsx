import './AddPost.css'
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // array för alla fel
    const [errors, setErrors] = useState<string[]>([]);
    const validateForm = () => {
        const newErrors: string[] = [];

        //Kontroll av input fält
        if (title.trim().length < 3) {
            newErrors.push("Titeln måste vara minst 3 tecken.");
        }

        if (content.trim().length < 3) {
            newErrors.push("Innehållet måste vara minst 3 tecken.");
        }

        return newErrors;
    };

    //Hanterare av skickandet av formulär
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        //Kontrollerar om valideringsfel finns
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // rensa fel
        setErrors([]);

        //Hämtar token från localStorage
        const token = localStorage.getItem("token");

        //Gör POST med giltigt token
        try {
            const res = await fetch(
                "https://blog-api-bzd2.onrender.com/api/posts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        content: content.trim(),
                    }),
                }
            );

            //Felmeddelande vid misslyckande
            if (!res.ok) {
                throw new Error("Kunde inte skapa post");
            }

            //Lyckas post skickas man till startsidan
            navigate("/");
        } catch (err) {
            
            //Felmeddelande
            setErrors(["Något gick fel vid skapandet av posten."]);
            console.error(err);
        }
    };

    //Formulärets utseende
    return (
         <div className="addpost-page">
            <form className="addpost-form" onSubmit={handleSubmit}>
                <h2>Välkommen {user?.username}!</h2>
                <h1>Skapa nytt inlägg</h1>

                <label>Titel</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Innehåll</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />

                <button type="submit">Skapa inlägg</button>

                {errors.length > 0 && (
                    <div className="errors">
                        {errors.map((err, index) => (<p key={index}>{err}</p>))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddPost;