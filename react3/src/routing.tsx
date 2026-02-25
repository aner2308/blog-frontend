import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddPost from "./pages/AddPost";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

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
                path: "/addpost",
                element: (
                    <ProtectedRoute>
                        <AddPost />
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