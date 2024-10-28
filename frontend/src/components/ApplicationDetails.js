import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ApplicationDetails = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/company/jobs/${jobId}/applications/`);
                console.log('Application Response Data:', response.data);
                setApplications(response.data); // Set applications as an array
            } catch (err) {
                setError("Error fetching application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [jobId]);

    const handleEachApplication = (application_id) => {
        navigate(`/company/jobs/${application_id}`);
    };

    const handleStatus = async (application_id, status) => {
        try {
            const response = await axios.patch(`http://localhost:8000/company/applications/${application_id}/update_status/`, { status: status });
            console.log('Application Response Data:', response.data);
            
            // Update the status in the local state
            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application.id === application_id ? { ...application, status: status } : application
                )
            );
        } catch (err) {
            setError("Error updating application status.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading application details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Application Details</h2>
            {applications.map((application, index) => (
                <div key={application.id} className="mb-3 border p-3">
                    <h3>Application {index + 1}</h3>
                    <p><strong>Application ID:</strong> {application.id}</p>
                    <p><strong>Student ID:</strong> {application.student_id}</p>
                    <p><strong>Job ID:</strong> {application.job_id}</p>
                    <p><strong>Status:</strong> {application.status}</p>
                    <button className="btn btn-success me-2" onClick={() => handleStatus(application.id, "approved")}>Accept</button>
                    <button className="btn btn-danger me-2" onClick={() => handleStatus(application.id, "rejected")}>Reject</button>
                    <button className="btn btn-info" onClick={() => handleEachApplication(application.id)}>View application</button>
                </div>
            ))}
        </div>
    );
};

export default ApplicationDetails;
