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
import Applications_by_jobid from './components/Applications_by_jobid';
import ApplicationDetails from './components/ApplicationDetails';
import SingleApplicationDetails from './components/SingleApplicationDetails';
import AppliedJobs from './components/AppliedJobs';

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
                    companyId={companyId} 
                />
                
                <Routes>
                    {/* Common Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={
                        <Login 
                            onLogin={(email, role) => { 
                                setUseId(email);
                                setUserRole(role);
                                localStorage.setItem(role === 'student' ? 'student_id' : 'employer_id', email);
                            }} 
                        />
                    } />

                    {/* Student Routes */}
                    {userRole === 'student' && userId && (
                        <>
                            <Route path="/profile" element={<UserProfile id={userId}/>} />
                            <Route path="/applied" element={<AppliedJobs/>} />
                            <Route path="/job-list" element={<JobList />} />
                        </>
                    )}

                    {/* Employer Routes */}
                    {userRole === 'employer' && userId && (
                        <>
                            <Route path="/create-job" element={<CreateJob id={userId}/>} />
                            <Route path="/job-listbycname/:id" element={<Joblist_bycname id={userId} />} />
                            <Route path="/company/jobs/:jobId/applications" element={<ApplicationDetails/>} />
                            <Route path="/company/jobs/:appId" element={<SingleApplicationDetails/>} />
                        </>
                    )}

                    {/* Redirect to Login if no userId */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

// Component to handle Navbar and logout functionality
const NavbarWrapper = ({ userId, userRole, setUseId, setUserRole }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('student_id');
        localStorage.removeItem('employer_id');
        setUseId(null);
        setUserRole(null);
        navigate('/login');
    };

    return (
        <>
            {!userId ? (
                <NavbarBasic />
            ) : (
                userRole === 'student' ? (
                    <NavbarStud userId={userId} handleLogout={handleLogout} />
                ) : (
                    <NavbarComp handleLogout={handleLogout} id={userId} />
                )
            )}
        </>
    );
};

export default App;
