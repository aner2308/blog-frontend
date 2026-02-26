import './EditPost.css'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const EditPost = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {

            try {
                const res = await fetch(
                    `https://blog-api-bzd2.onrender.com/api/posts/${id}`
                );
                const data = await res.json();

                setTitle(data.title);
                setContent(data.content);
                setLoading(false);
            } catch (error) {
                console.error("Kunde inte hämta posten");
            }
        };

        fetchPost();
    }, [id]);

    const validateForm = () => {
        const newErrors: string[] = [];

        if (title.trim().length < 3) {
            newErrors.push("Titeln måste vara minst 3 tecken.");
        }

        if (content.trim().length < 3) {
            newErrors.push("Innehållet måste vara minst 3 tecken.");
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        //Lägger in eventuella felmeddelanden i setErrors
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        //Rensar felmeddelanden om de är lösta
        setErrors([]);

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`https://blog-api-bzd2.onrender.com/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                }),
            });

            if (!res.ok) {
                throw new Error("Kunde inte uppdatera posten");
            }

            navigate(`/posts/${id}`);

        } catch (error) {
            setErrors(["Något gick fel vid uppdateringen av inlägget.."])
        }
    }

    if (loading) return <p>Laddar...</p>;

    return (
        <div>
            <h1>Redigera inlägg</h1>

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

                <button type="submit">Spara ändringar</button>

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
}

export default EditPost
