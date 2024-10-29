import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]); // Stores IDs of already applied jobs
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('student_id'));
    const [studentId, setStudentId] = useState(localStorage.getItem('student_id'));
    const [showLogin, setShowLogin] = useState(!isLoggedIn);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobResponse = await axios.get(`http://localhost:8000/company/jobs/`);
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

    const handleApply = (jobId) => {
        if (selectedJobId === jobId) {
            setSelectedJobId(null); // Deselect if already selected
        } else {
            setSelectedJobId(jobId); // Select job for answering questions
        }
    };

    const handleAnswerChange = (questionId, answerText) => {
        setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answerText }));
    };

    const handleSubmitApplication = (jobId) => {
        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            question_id: questionId,
            answer_text: answers[questionId],
        }));

        axios.post(`http://localhost:8000/company/create_application/`, {
            student_id: studentId,
            job_id: jobId,
            answers: formattedAnswers,
        })
        .then(() => {
            alert(`Successfully applied for job: ${jobId}`);
            setAppliedJobs((prev) => [...prev, jobId]); // Update applied jobs list
            setSelectedJobId(null);
            setAnswers({});
        })
        .catch(() => {
            alert(`Error applying for job: ${jobId}`);
        });
    };

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
            {showLogin && (
                <div className="mb-4">
                    <h4>Please Login to Apply for Jobs</h4>
                    <Login onLogin={handleLogin} />
                </div>
            )}
            {jobs.length > 0 ? (
                <div className="row">
                    {jobs.map((job) => (
                        <div key={job.id} className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="card-title">
                                        {job.job_name} <span className="badge bg-secondary">{job.job_role}</span>
                                    </h3>
                                    <h5 className="card-subtitle mb-2 text-muted">
                                        {job.company.name} - {job.company.location}
                                    </h5>
                                    <p className="card-text">{job.job_description}</p>
                                    <p className="card-text"><strong>Last Date to Apply:</strong> {job.last_date}</p>

                                    {/* Apply Button */}
                                    {appliedJobs.includes(job.id) ? (
                                        <button className="btn btn-secondary mb-3" disabled>Applied</button>
                                    ) : (
                                        <button 
                                            onClick={() => handleApply(job.id)} 
                                            className="btn btn-primary mb-3"
                                        >
                                            {selectedJobId === job.id ? 'Cancel' : 'Apply'}
                                        </button>
                                    )}

                                    {/* Show questions and input fields */}
                                    {selectedJobId === job.id && isLoggedIn && !appliedJobs.includes(job.id) && (
                                        <div>
                                            <h5>Answer the following questions:</h5>
                                            <ul className="list-group mb-3">
                                                {job.questions.map((question) => (
                                                    <li key={question.id} className="list-group-item">
                                                        <p>{question.question_text}</p>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Your answer" 
                                                            value={answers[question.id] || ''} 
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)} 
                                                            className="form-control mb-2"
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                            <button 
                                                onClick={() => handleSubmitApplication(job.id)} 
                                                className="btn btn-success"
                                            >
                                                Submit Application
                                            </button>
                                        </div>
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
