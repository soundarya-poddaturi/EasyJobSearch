import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'; 
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import JobList from './components/JobList';
import Joblist_bycname from './components/Joblist_bycname';
import CreateJob from './components/CreateJob';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarStud from './components/NavbarStud';
import NavbarComp from './components/NavbarComp';
import NavbarBasic from './components/NavbarBasic';

function App() {
    const [userId, setUseId] = useState(localStorage.getItem('student_id') || localStorage.getItem('employer_id'));
    const [userRole, setUserRole] = useState(localStorage.getItem('student_id') ? 'student' : 'employer');
    const [companyId, setCompanyId] = useState(localStorage.getItem('employerId')); // Retrieve company ID from local storage

    return (
        
        <Router>
            <div className="App">
                <NavbarWrapper 
                    userId={userId} 
                    userRole={userRole} 
                    setUseId={setUseId} 
                    setUserRole={setUserRole} 
                    companyId={companyId} // Pass companyId to NavbarWrapper
                />
                
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login 
                        onLogin={(email, role) => { 
                            setUseId(email);
                            setUserRole(role);
                            console.log(email)
                            localStorage.setItem(role === 'student' ? 'student_id' : 'student_id', email);
                        }} 
                    />} />
                    {/* <Route path="/profile" element={userId ? <UserProfile email={userId}/> : <Navigate to="/login" />} /> */}
                    <Route path="/profile" element={<UserProfile id={userId}/> } />
                    <Route path="/create-job" element={<CreateJob id={userId}/>} />
                    <Route path="/job-list" element={<JobList />} />
                    <Route path="/job-listbycname/:id" element={<Joblist_bycname id={userId} />} />
                </Routes>
            </div>
        </Router>
    );
}

// Create a separate component to handle navigation and logout
const NavbarWrapper = ({ userId, userRole, setUseId, setUserRole}) => {
    console.log(userId)
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('student_id');
        localStorage.removeItem('employer_id'); // Remove employer ID from local storage
        setUseId(null);
        setUserRole(null);
        navigate('/login'); // Navigate to login after logout
    };

    return (
        <>
            {!userId ? (
                <NavbarBasic />
            ) : (
                userRole === 'student' ? (
                    <NavbarStud userId={userId} handleLogout={handleLogout} />
                ) : (
                    <NavbarComp handleLogout={handleLogout} id={userId} /> // Pass companyId to NavbarComp
                )
            )}
        </>
    );
};


export default App;
