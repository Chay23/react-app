import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom'

function Nav(){
    return(
        <nav className="navbar navbar-dark bg-dark">
            <ul>
                <Link to="/">
                    <li class="navbar-brand">Main</li>
                </Link>
                <Link to="/login">
                    <li class="navbar-brand">Sing In</li>
                </Link>
                <Link to="/registration">
                    <li class="navbar-brand">Sing Up</li>
                </Link>
                <Link to="/users">
                    <li class="navbar-brand">Users</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;