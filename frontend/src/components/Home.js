import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import Login from './Login';
import Register from './Register';

export const Home = ({ setUseId, setUserRole }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for student_id or employer_id in localStorage to determine if the user is logged in
        const studentId = localStorage.getItem('student_id');
        const employerId = localStorage.getItem('employer_id');
        setIsLoggedIn(!!studentId || !!employerId);
        console.log(!!studentId || !!employerId)
    }, []);

    return (
        <div className="container">
            <div className="row">
                {/* JobList on the left side */}
                {/* <div className="col-6">
                    <JobList />
                </div> */}
                
                {/* Login/Register section on the right side if no user is logged in */}
                <h1>HELOOO</h1>
                {!isLoggedIn && (
                    <div className="">
                        <div className="d-flex justify-content-end mb-3">
                            <Login 
                                onLogin={(email, role) => { 
                                    console.log(email);
                                    setUseId(email);  // This should now correctly reference the function
                                    setUserRole(role);
                                    localStorage.setItem(role === 'student' ? 'student_id' : 'employer_id', email);
                                }} 
                            />
                            <Register />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
