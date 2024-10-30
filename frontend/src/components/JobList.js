import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('student_id'));
    const [studentId, setStudentId] = useState(localStorage.getItem('student_id'));
    const [showLogin, setShowLogin] = useState(!isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobResponse = await axios.get(`http://localhost:8000/company/jobs/`);
                console.log(jobResponse)
                setJobs(jobResponse.data);

                if (studentId) {
                    const appliedResponse = await axios.get(`http://localhost:8000/company/applications/student/${studentId}/`);
                    setAppliedJobs(appliedResponse.data.application_ids);
                }
            } catch (err) {
                setError('Error fetching jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [studentId]);

    const handleLogin = (email, studentId) => {
        localStorage.setItem('student_id', studentId);
        setIsLoggedIn(true);
        setStudentId(studentId);
        setShowLogin(false);
    };

    if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Job List</h2>
            {/* {showLogin && (
                <div className="mb-4">
                    <h4>Please Login to Apply for Jobs</h4>
                    <Login onLogin={handleLogin} />
                </div>
            )} */}
            {jobs.length > 0 ? (
                <div className="row">
                    {jobs.map((job) => (
                        <div key={job.id} className="col-md-6 mb-4">
                            <div className="card" onClick={() => navigate(`/job-details/${job.id}`)} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <h3 className="card-title">
                                        {job.job_name} <span className="badge bg-secondary">{job.job_role}{job.id}</span>
                                    </h3>
                                    <h5 className="card-subtitle mb-2 text-muted">
                                        {job.company.name} - {job.company.location}
                                    </h5>
                                    <p className="card-text">{job.experience}</p>
                                    <p className="card-text">{job.type}</p>
                                    <p className="card-text"><strong>Last Date to Apply:</strong> {job.last_date}</p>

                                    {appliedJobs.includes(job.id) ? (
                                        <button className="btn btn-secondary mb-3" disabled>Applied</button>
                                    ) : (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents triggering card click
                                                navigate(`/job-details/${job.id}`);
                                            }} 
                                            className="btn btn-primary mb-3"
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No jobs found.</p>
            )}
        </div>
    );
}

export default JobList;
