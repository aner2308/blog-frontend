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
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (trimmedTitle.length < 3) {
            newErrors.push("Titeln måste vara minst 3 tecken och får inte vara bara mellanslag.");
        }

        if (trimmedContent.length < 3) {
            newErrors.push("Innehållet måste vara minst 3 tecken och får inte vara bara mellanslag.");
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // rensa fel
        setErrors([]);

        const token = localStorage.getItem("token");

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

            if (!res.ok) {
                throw new Error("Kunde inte skapa post");
            }

            navigate("/");
        } catch (err) {
            setErrors(["Något gick fel vid skapandet av posten."]);
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Välkommen {user?.username}!</h2>

            <h1>Skapa nytt inlägg</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titel</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label>Innehåll</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <button type="submit">Skapa inlägg</button>

                {/* Visar felmeddelanden under formuläret */}
                {errors.length > 0 && (
                    <div style={{ color: "red", marginTop: "10px" }}>
                        {errors.map((err, index) => (
                            <p key={index}>{err}</p>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddPost;