import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role is 'student'
    const [error, setError] = useState('');
    const [showEmployerOption, setShowEmployerOption] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = role === 'student'
            ? 'http://localhost:8000/api/login/'
            : 'http://localhost:8000/company/login_company/';

        axios.post(url, { email, password })
            .then(response => {
                console.log(response.data)
                // const storageKey = role === 'student' ? 'student_id' : 'employer_id';
                // localStorage.setItem(storageKey, response.data.user.id); // Store the email
               
                onLogin(response.data.user.id, role); // Pass both email and role here

                // Redirect the user based on their role
                if (role === 'student') {
                    navigate('/job-list'); // Navigate to Job List if student
                } else {
                    navigate(`/job-listbycname/${response.data.user.id}`); // Navigate to job list by company ID if employer
                }
            })
            .catch(err => {
                setError('Invalid credentials');
                console.error('Login error:', err);
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login as {role === 'student' ? 'Student' : 'Employer'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {!showEmployerOption && (
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={() => {
                                                setShowEmployerOption(true);
                                                setRole('employer');
                                            }}
                                        >
                                            Login as Employer
                                        </button>
                                    </div>
                                )}

                                {error && <p className="text-danger">{error}</p>}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
