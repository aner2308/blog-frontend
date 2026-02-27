import './EditPost.css'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


//Redigera befintlig post
const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    //Hämta in posten när sidan laddas
    useEffect(() => {
        const fetchPost = async () => {
            try {
                //Hämtar post utifrån ID
                const res = await fetch(`https://blog-api-bzd2.onrender.com/api/posts/${id}`);
                const data = await res.json();

                //Fyller i formuläret med hämtad data
                setTitle(data.title);
                setContent(data.content);

                //Stänger av loading-meddelande
                setLoading(false);
            } catch (error) {
                console.error("Kunde inte hämta posten");
            }
        };

        fetchPost();
    }, [id]);

    //Validerar formulär innan uppdatering
    const validateForm = () => {
        const newErrors: string[] = [];
        if (title.trim().length < 3) newErrors.push("Titeln måste vara minst 3 tecken.");
        if (content.trim().length < 3) newErrors.push("Innehållet måste vara minst 3 tecken.");
        return newErrors;
    };

    //Hanterar submit av formuläret
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        //Kör validering
        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        //Rensa gamla felmeddelanden
        setErrors([]);

        //Hämta token från LocalStorage
        const token = localStorage.getItem("token");

        //PUT för att uppdatera posten
        try {
            const res = await fetch(`https://blog-api-bzd2.onrender.com/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ title: title.trim(), content: content.trim() }),
            });

            if (!res.ok) throw new Error("Kunde inte uppdatera posten");

            //Navigerar til postens undersida vid lyckad updatering
            navigate(`/posts/${id}`);
        } catch (error) {
            setErrors(["Något gick fel vid uppdateringen av inlägget.."]);
        }
    }

    //Inladdningsmeddelande
    if (loading) return <p>Laddar...</p>;

    //Formulärets utseende
    return (
        <div className="editpost-page">
            <form className="editpost-form" onSubmit={handleSubmit}>
                <h1>Redigera inlägg</h1>

                <label>Titel</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Innehåll</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />

                <button type="submit">Spara ändringar</button>

                {errors.length > 0 && (
                    <div className="errors">
                        {errors.map((err, index) => (<p key={index}>{err}</p>))}
                    </div>
                )}
            </form>
        </div>
    );
}

export default EditPost;