import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddPost from "./pages/AddPost";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import SinglePostPage from "./pages/SinglePostPage";
import EditPost from "./pages/EditPost";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/posts/:id",
                element: <SinglePostPage />
            },
            {
                path: "/addpost",
                element: (
                    <ProtectedRoute>
                        <AddPost />
                    </ProtectedRoute>
                )
            },
            {
                path: "/edit/:id",
                element: (
                    <ProtectedRoute>
                        <EditPost />
                    </ProtectedRoute>
                )
            },
            {
                path: "/login",
                element: <LoginPage />
            }
        ]
    }
])

export default router;