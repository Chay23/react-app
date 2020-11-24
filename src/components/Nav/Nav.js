import React from 'react';
import './Nav.module.css';
import {Link} from 'react-router-dom'

function Nav(){
    return(
        <nav>
            <ul>
                <Link to="/login">
                    <li>Sing In</li>
                </Link>
                <Link to="/registration">
                    <li>Sing Up</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;