import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom'

function Nav(){
    return(
        <nav className="navbar navbar-dark bg-dark">
            <ul>
                <Link to="/">
                    <li className="navbar-brand">Main</li>
                </Link>
                <Link to="/login">
                    <li className="navbar-brand">Sign In</li>
                </Link>
                <Link to="/registration">
                    <li className="navbar-brand">Sign Up</li>
                </Link>
                <Link to="/users">
                    <li className="navbar-brand">Users</li>
                </Link>
                <Link to="/assignments">
                    <li className="navbar-brand">Assignments</li>
                </Link>
                <Link to="/subjects">
                    <li className="navbar-brand">Subjects</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;