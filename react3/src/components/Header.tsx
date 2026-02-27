import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Header.css"

const Header = () => {

    const { user, logout } = useAuth();

    //Nav-meny
    return (
        <header>
            <div className="logo">Bloggie</div>

            <nav>
                <ul>
                    <li><NavLink to="/">Startsida</NavLink></li>
                    <li><NavLink to="/addpost">Skapa inlägg</NavLink></li>
                    <li>
                        {
                            //Logga in knapp som byts till logga ut om man är inloggad
                            !user ? <NavLink to="/login">Logga in</NavLink> : <button onClick={logout} >Logga ut</button>

                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
