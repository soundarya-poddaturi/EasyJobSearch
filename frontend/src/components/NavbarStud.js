import React from 'react';
import { Link } from 'react-router-dom';

const NavbarStud = ({ userEmail, handleLogout }) => {
    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 fs-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/job-list">HOME</a>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNavDropdown" 
                        aria-controls="navbarNavDropdown" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            {/* <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li> */}
                           
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/profile">Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                        
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavbarStud;
