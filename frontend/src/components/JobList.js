import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/jobs/')
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <ul>
            {jobs.map(job => (
                <li key={job.id}>{job.title} - {job.company}</li>
            ))}
        </ul>
    );
};

export default JobList;
