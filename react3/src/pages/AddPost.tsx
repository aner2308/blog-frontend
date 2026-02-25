import React from 'react'
import { useAuth } from '../context/AuthContext'

const AddPost = () => {

    const { user } = useAuth();

    return (
        <div>
            <h1>Välkommen {user?.username}!</h1>
        </div>
    )
}

export default AddPost
