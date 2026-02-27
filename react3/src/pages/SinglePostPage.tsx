import "./SinglePostPage.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//INterface för posten
interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

//Visar enskilt blogginlägg
const SinglePostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);

    //Hämtar posten när sidan laddas
    useEffect(() => {
        const fetchPost = async () => {
            try {

                //GET för att hämta post utifrån ID
                const res = await fetch(
                    `https://blog-api-bzd2.onrender.com/api/posts/${id}`
                );
                const data = await res.json();

                //Sparar posten i state
                setPost(data);
            } catch (error) {
                console.error("Kunde inte hämta posten");
            }
        };

        fetchPost();
    }, [id]); //Körs igen om ID ändras

    //Radera inlägg
    const handleDelete = async () => {

        //Är du säker? -ruta
        const confirmed = window.confirm("Är du säker på att du vill radera inlägget?");
        if (!confirmed) return;

        //Hämtar JWT token för att se om man är inloggad och har behörighet
        const token = localStorage.getItem("token");

        try {
            //DELETE anrop till API
            const res = await fetch(
                `https://blog-api-bzd2.onrender.com/api/posts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (!res.ok) throw new Error("Kunde inte radera");

            //Navigerar tillbaka till startsidan efter radering
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    //Inladdningsmeddelande
    if (!post) return <p>Laddar...</p>;

    //Utseende på sidan
    return (
        <div className="singlepost-page">
            <div className="singlepost-card">
                <h1>{post.title}</h1>

                <small className="singlepost-date">
                    Publicerad:{" "}
                    {new Date(post.createdAt).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </small>

                <div className="singlepost-content">
                    {post.content}
                </div>

                <Link to="/" className="singlepost-back">
                    ← Tillbaka
                </Link>

                {user && (
                    <div className="singlepost-buttons">
                        <button onClick={() => navigate(`/edit/${post._id}`)}>
                            Redigera
                        </button>
                        <button onClick={handleDelete}>
                            Radera
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePostPage;