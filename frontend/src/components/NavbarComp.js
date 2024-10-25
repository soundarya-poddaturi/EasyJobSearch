import React from 'react';
import { Link } from 'react-router-dom';

const NavbarComp = ({ handleLogout, id }) => {
    console.log(id)
    const id1=localStorage.getItem("employer_id")
    console.log(id1)
    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 fs-4">
                <div className="container-fluid">
                    {/* Pass the companyId to the route */}
                    <Link className="navbar-brand" to={`/job-listbycname/${id1}`}>HOME</Link>
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/create-job">Create Job</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavbarComp;
