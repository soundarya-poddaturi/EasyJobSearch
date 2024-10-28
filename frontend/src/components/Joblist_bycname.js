import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams ,useNavigate} from 'react-router-dom'; // Import useParams to get route parameters

const Joblist_bycname = () => {
    const { id } = useParams(); // Get the company ID from the URL parameters
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            handleSearch(); // Automatically fetch jobs when the component mounts
        }
    }, [id]);
    const navigate=useNavigate();
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/company/${id}/jobs/`);
            setJobs(response.data);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch jobs. Please try again.');
            setJobs([]); // Clear jobs if there's an error
        }
    };
    const handleApplication = async (jobId) => {
        navigate(`/company/jobs/${jobId}/applications`);
    };

    return (
        <div className="container my-4">
            <h1 className="mb-4">Job Listings for Company ID: {id}</h1>

            {error && <p className="text-danger">{error}</p>}

            <div className="row">
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <div key={job.job_id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{job.job_name}</h5>
                                    <p className="card-text">{job.job_description}</p>
                                    <p className="card-text"><strong>Role:</strong> {job.job_role}</p>
                                    <p className="card-text"><strong>Last Date:</strong> {job.last_date}</p>
                                </div>
                                <div className="card-footer">
                                    <button onClick={()=>handleApplication(job.job_id)}>Check Applications</button>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">No Job Listings Available</h5>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Joblist_bycname;
