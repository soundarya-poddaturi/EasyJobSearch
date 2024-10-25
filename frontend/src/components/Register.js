import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isEmployer, setIsEmployer] = useState(false); // To toggle between student and employer
    const [employerData, setEmployerData] = useState({
        email: '',
        password: '',
        name: '',
        location: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = isEmployer ? employerData : formData;
        const url = isEmployer 
            ? 'http://localhost:8000/company/register_company/' 
            : 'http://localhost:8000/api/register/';

        axios.post(url, dataToSend)
            .then(response => {
                setMessage('Registration successful!');
                console.log(response.data);
                // Reset forms after successful registration
                setFormData({ email: '', password: '' });
                setEmployerData({ email: '', password: '', name: '', location: '' });
            })
            .catch(error => {
                setMessage('Registration failed. Please try again.');
                console.error('Error:', error);
            });
    };

    const handleEmployerClick = () => {
        setIsEmployer(true);
    };

    const handleStudentClick = () => {
        setIsEmployer(false);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2>{isEmployer ? 'Employer' : 'Student'} Registration</h2>
                    <div className="btn-group mb-4" role="group">
                        <button 
                            type="button" 
                            className={`btn btn-${isEmployer ? 'secondary' : 'primary'}`} 
                            onClick={handleStudentClick}
                        >
                            Student
                        </button>
                        <button 
                            type="button" 
                            className={`btn btn-${isEmployer ? 'primary' : 'secondary'}`} 
                            onClick={handleEmployerClick}
                        >
                            Employer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email"
                                value={isEmployer ? employerData.email : formData.email}
                                onChange={(e) => {
                                    if (isEmployer) {
                                        setEmployerData({ ...employerData, email: e.target.value });
                                    } else {
                                        setFormData({ ...formData, email: e.target.value });
                                    }
                                }}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password"
                                value={isEmployer ? employerData.password : formData.password}
                                onChange={(e) => {
                                    if (isEmployer) {
                                        setEmployerData({ ...employerData, password: e.target.value });
                                    } else {
                                        setFormData({ ...formData, password: e.target.value });
                                    }
                                }}
                                required
                            />
                        </div>

                        {isEmployer && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Company Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name"
                                        value={employerData.name}
                                        onChange={(e) => setEmployerData({ ...employerData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="location"
                                        value={employerData.location}
                                        onChange={(e) => setEmployerData({ ...employerData, location: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-primary">Register</button>
                    </form>
                    {message && <div className="mt-3 alert alert-info">{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default Register;
