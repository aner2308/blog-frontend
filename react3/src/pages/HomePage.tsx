import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './HomePage.css'

interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

import HeaderL from "../assets/Header-L.jpg"
import HeaderM from "../assets/Header-M.jpg"
import HeaderS from "../assets/Header-S.jpg"

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const res = await fetch(
                "https://blog-api-bzd2.onrender.com/api/posts"
            );
            const data = await res.json();
            setPosts(data);
            setLoading(false);

        } catch (error) {
            console.error("Kunde inte hämta posts");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {

        //Ruta för att bekräfta radering
        const confirmed = window.confirm(
            "Är du säker på att du vill radera detta inlägg?"
        );

        if (!confirmed) return;

        //Hämtar token från localStorage, och kör delete-routen
        const token = localStorage.getItem("token");

        await fetch(
            `https://blog-api-bzd2.onrender.com/api/posts/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );

        //uppdaterar listan
        fetchPosts();
    };

    if (loading) return <p>Laddar...</p>;

    return (
        <div>

            <section className="hero">
                <picture>
                    <source media="(max-width: 600px)" srcSet={HeaderS} />
                    <source media="(max-width: 900px)" srcSet={HeaderM} />
                    <img src={HeaderL} alt="Headerbild" />
                </picture>

                <div className="hero-text">
                    <h1>Välkommen till min blogg</h1>
                </div>
            </section>

            {posts.map((post) => (
                <div className="homepage" key={post._id}>
                    <div className="post-card">
                        <h2>{post.title}</h2>

                        <p>
                            <small>
                                Publicerad:{" "}
                                {new Date(post.createdAt).toLocaleDateString("sv-SE", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </small>
                        </p>

                        <p>{post.content}</p>

                        <Link to={`/posts/${post._id}`}>Läs mer här...</Link>

                        {user && (
                            <div className="post-buttons">
                                <button onClick={() => navigate(`/edit/${post._id}`)}>Redigera</button>
                                <button onClick={() => handleDelete(post._id)}>Radera</button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomePage;
