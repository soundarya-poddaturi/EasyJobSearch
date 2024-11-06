import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const JobList = ({ isSidebarOpen }) => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [salaryRange, setSalaryRange] = useState({ min: 0, max: 0 });

    // Options for filters
    const [roleOptions, setRoleOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);

    const studentId = localStorage.getItem('student_id');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/jobs/`);
                const jobData = jobResponse.data;
                setJobs(jobData);
                setFilteredJobs(jobData); // Initialize with all jobs

                // Extract unique roles and company names based on your data structure
                const roles = [...new Set(jobData.map(job => job.job_role))];
                const companies = [...new Set(jobData.map(job => job.company.name))];

                setRoleOptions(roles);
                setCompanyOptions(companies);

                if (studentId) {
                    const applicationIdsResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/applications/student/${studentId}/`);
                    const applicationIds = applicationIdsResponse.data.application_ids;

                    const appliedJobIds = await Promise.all(
                        applicationIds.map(async (appId) => {
                            const appResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/applications/${appId}/`);
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

    const handleRoleChange = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleCompanyChange = (company) => {
        setSelectedCompanies(prev =>
            prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
        );
    };

    const handleSalaryChange = (min, max) => {
        setSalaryRange({ min, max });
    };

    useEffect(() => {
        const applyFilters = () => {
            let updatedJobs = jobs;

            if (selectedRoles.length > 0) {
                updatedJobs = updatedJobs.filter(job => selectedRoles.includes(job.job_role));
            }

            if (selectedCompanies.length > 0) {
                updatedJobs = updatedJobs.filter(job => selectedCompanies.includes(job.company.name));
            }

            if (salaryRange.min || salaryRange.max) {
                updatedJobs = updatedJobs.filter(job => {
                    return job.salary >= salaryRange.min && (salaryRange.max === 0 || job.salary <= salaryRange.max);
                });
            }

            setFilteredJobs(updatedJobs);
        };

        applyFilters();
    }, [selectedRoles, selectedCompanies, salaryRange, jobs]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Jobs</h2>
            <div className="row">
                <div className="col-md-3">
                    {/* Filter Sidebar */}
                    <h4>Filters</h4>
                    <div className="mb-3">
                        <h5>Job Role</h5>
                        {roleOptions.length > 0 ? roleOptions.map(role => (
                            <div key={role}>
                                <input
                                    type="checkbox"
                                    checked={selectedRoles.includes(role)}
                                    onChange={() => handleRoleChange(role)}
                                />
                                <label>{role}</label>
                            </div>
                        )) : <p>No roles available</p>}
                    </div>
                    <div className="mb-3">
                        <h5>Company</h5>
                        {companyOptions.length > 0 ? companyOptions.map(company => (
                            <div key={company}>
                                <input
                                    type="checkbox"
                                    checked={selectedCompanies.includes(company)}
                                    onChange={() => handleCompanyChange(company)}
                                />
                                <label>{company}</label>
                            </div>
                        )) : <p>No companies available</p>}
                    </div>
                    <div className="mb-3">
                        <h5>Salary Range</h5>
                        <div>
                            <input
                                type="number"
                                placeholder="Min Salary"
                                onChange={(e) => handleSalaryChange(Number(e.target.value), salaryRange.max)}
                            />
                            <input
                                type="number"
                                placeholder="Max Salary"
                                onChange={(e) => handleSalaryChange(salaryRange.min, Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="col-md-9">
                    {/* Job List */}
                    {filteredJobs.length > 0 ? (
                        <div className="row justify-content-center">
                            {filteredJobs.map((job) => (
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
            </div>
        </div>
    );
};

export default JobList;
