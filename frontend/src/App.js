import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile'; // Import UserProfile component
// import JobList from './components/JobList';
import './App.css';

function App() {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Check if there's a stored email in localStorage to maintain session
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
    }, []);

    const handleLogin = (email) => {
        setUserEmail(email);
    };

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        setUserEmail(null);
    };

    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><a href="/register">Register</a></li>
                        <li><a href="/login">Login</a></li>
                        {userEmail && (
                            <>
                                <li><a href="/profile">Profile</a></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </>
                        )}
                        <li><a href="/jobs">Job List</a></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/profile" element={userEmail ? <UserProfile email={userEmail} /> : <Navigate to="/profile" />} />
                    {/* <Route path="/jobs" element={<JobList />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
