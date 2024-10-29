import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import Login from './Login';
import Register from './Register';

export const Home = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for student_id or employer_id in localStorage to determine if the user is logged in
        const studentId = localStorage.getItem('student_id');
        const employerId = localStorage.getItem('employer_id');
        setIsLoggedIn(!!studentId || !!employerId);
    }, []);

    return (
        <div className="container">
            <div className="row">
                {/* JobList on the left side */}
                <div className="col-6">
                    <JobList />
                </div>
                
                {/* Login/Register section on the right side if no user is logged in */}
                {!isLoggedIn && (
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <button 
                                className="btn btn-primary me-2" 
                                onClick={() => setActiveComponent('login')}
                            >
                                Login
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => setActiveComponent('register')}
                            >
                                Register
                            </button>
                        </div>

                        {/* Conditionally render Login or Register component */}
                        {activeComponent === 'login' && <Login />}
                        {activeComponent === 'register' && <Register />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
