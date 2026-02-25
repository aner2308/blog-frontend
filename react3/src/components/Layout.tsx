import Header from "./Header"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <footer>Sidfot för alla sidor</footer>
        </>
    )
}

export default Layout
