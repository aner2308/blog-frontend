import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddPost from "./pages/AddPost";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";

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
                element: <AddPost />
            },
            {
                path: "/login",
                element: <LoginPage />
            }
        ]
    }
])

export default router;