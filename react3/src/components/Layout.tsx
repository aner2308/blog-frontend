import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"

//Layout för mina undersidor
const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer/>
        </>
    )
}

export default Layout
