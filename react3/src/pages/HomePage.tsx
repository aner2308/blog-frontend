import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useAuth();

    const fetchPosts = async () => {
        try {
            const res = await fetch(
                "https://blog-api-bzd2.onrender.com/api/posts"
            );
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Kunde inte hämta posts");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
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

        //uppdatera listan
        fetchPosts();
    };

    return (
        <div>
            <h1>Alla inlägg</h1>

            {posts.map((post) => (
                <div key={post._id}>

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

                    <Link to={`/posts/${post._id}`}><p>Läs mer här...</p></Link>

                    {user && (
                        <div>
                            <button>Redigera</button>
                            <button onClick={() => handleDelete(post._id)}>
                                Radera
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default HomePage;
