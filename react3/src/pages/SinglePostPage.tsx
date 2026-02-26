import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

const SinglePostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(
                    `https://blog-api-bzd2.onrender.com/api/posts/${id}`
                );
                const data = await res.json();
                setPost(data);
            } catch (error) {
                console.error("Kunde inte hämta posten");
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `https://blog-api-bzd2.onrender.com/api/posts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Kunde inte radera");
            }

            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    if (!post) return <p>Laddar...</p>;

    return (
        <div>
            <h1>{post.title}</h1>

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

            <Link to={`/`}><p>Tillbaka</p></Link>

            {user && (
                <div>
                    <button onClick={() => navigate(`/edit/${post._id}`)}>
                        Redigera
                    </button>

                    <button onClick={handleDelete}>
                        Radera
                    </button>
                </div>
            )}
        </div>
    );
};

export default SinglePostPage;