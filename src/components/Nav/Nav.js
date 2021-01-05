import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom'

function Nav (props) {
    return(
        <nav className="navbar navbar-dark bg-dark">
            <ul>
                <Link to="/">
                    <li className="navbar-brand custom-nav-link">Main</li>
                </Link>
                {props.requireLogin() ? 
                    <Link to="/login">
                        <li className="navbar-brand custom-nav-link">Sign in</li>
                    </Link> : ""
                }
                {props.requireLogin() ? 
                    <Link to="/registration">
                        <li className="navbar-brand custom-nav-link">Sign Up</li>
                    </Link> : ""
                }
                {props.requireLogin() ? 
                    "" : <Link to="/users">
                            <li className="navbar-brand custom-nav-link">Users</li>
                        </Link> 
                }
                {props.requireLogin() ? 
                    "" :<Link to="/assignments">
                            <li className="navbar-brand custom-nav-link">Assignments</li>
                        </Link>
                }
                {props.requireLogin() ? 
                    "" :<Link to="/subjects">
                            <li className="navbar-brand custom-nav-link">Subjects</li>
                        </Link>
                }
                {props.requireLogin() ? 
                    "" :<Link to="/login">
                            <li className="navbar-brand custom-nav-link custom-logout" onClick={props.logout}>Logout</li>
                        </Link>
                }               
            </ul>
        </nav>
    );
}

export default Nav;