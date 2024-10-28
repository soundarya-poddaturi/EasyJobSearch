import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppliedJobs = () => {
    const userId = localStorage.getItem('student_id');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/company/applications/student/${userId}/`);
                const applicationIds = response.data.application_ids;

                // Fetch details for each application ID
                const applicationDetails = await Promise.all(
                    applicationIds.map(async (appId) => {
                        const appResponse = await axios.get(`http://localhost:8000/company/applications/${appId}/`);
                        const jobResponse = await axios.get(`http://localhost:8000/company/jobs/${appResponse.data.job_id}/`);
                        return { ...appResponse.data, job: jobResponse.data }; // Combine application and job data
                    })
                );
                console.log(applicationDetails)
                setApplications(applicationDetails);
            } catch (err) {
                setError('Error fetching applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [userId]);

    if (loading) return <div>Loading applications...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Applied Jobs</h2>
            {applications.length > 0 ? (
                applications.map((application) => (
                    <div key={application.id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{application.job.job_name}</h5> {/* Display job name */}
                            <p><strong>Job Role:</strong> {application.job.job_role}</p> {/* Job role */}
                            <p><strong>Company:</strong> {application.job.company_details.name}</p> {/* Company name */}
                            <p><strong>Location:</strong> {application.job.company_details.location}</p> {/* Company location */}
                            <p><strong>Status:</strong> {application.status}</p>
                            {/* <p><strong>Application Date:</strong> {application.date_applied}</p> */}
                            <p><strong>Last Date to Apply:</strong> {application.job.last_date}</p> {/* Last date to apply */}
                            <h6 className="mt-3">Job Description:</h6>
                            <p>{application.job.job_description}</p> {/* Job description */}
                            <h6>Answers to Questions:</h6>
                            <ul>
                                {application.answers.map(answer => (
                                    <li key={answer.id}>
                                        <strong>Q:</strong> {answer.question.question_text} <br />
                                        <strong>A:</strong> {answer.answer_text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))
            ) : (
                <div>No applications found.</div>
            )}
        </div>
    );
};

export default AppliedJobs;
