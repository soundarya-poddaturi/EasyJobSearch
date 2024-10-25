import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get route parameters

const Joblist_bycname = () => {
    const { id } = useParams(); // Get the company ID from the URL parameters
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            handleSearch(); // Automatically fetch jobs when the component mounts
        }
    }, [id]);

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

    return (
        <div>
            <h1>Job Listings for Company ID: {id}</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {jobs.map(job => (
                    <li key={job.job_id}>
                        <h2>{job.job_name}</h2>
                        <p>{job.job_description}</p>
                        <p>Role: {job.job_role}</p>
                        <p>Last Date: {job.last_date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Joblist_bycname;
