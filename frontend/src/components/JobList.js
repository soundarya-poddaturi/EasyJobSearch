import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const JobList = ({ isSidebarOpen }) => {
   
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const studentId = localStorage.getItem('student_id');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobResponse = await axios.get(`http://localhost:8000/company/jobs/`);
                setJobs(jobResponse.data);

                if (studentId) {
                    const applicationIdsResponse = await axios.get(`http://localhost:8000/company/applications/student/${studentId}/`);
                    const applicationIds = applicationIdsResponse.data.application_ids;

                    const appliedJobIds = await Promise.all(
                        applicationIds.map(async (appId) => {
                            const appResponse = await axios.get(`http://localhost:8000/company/applications/${appId}/`);
                            return appResponse.data.job_id;
                        })
                    );

                    setAppliedJobs(appliedJobIds);
                }
            } catch (err) {
                setError('Error fetching jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [studentId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Jobs</h2>
            {jobs.length > 0 ? (
                <div className="row justify-content-center">
                    
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isApplied={appliedJobs.includes(job.id)}
                            onApplyClick={() => console.log(`Applying for job ${job.id}`)}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ))}
                </div>
            ) : (
                <p>No jobs found.</p>
            )}
        </div>
    );
};

export default JobList;
