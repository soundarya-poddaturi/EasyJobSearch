import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, isApplied, onApplyClick, isSidebarOpen ,status}) => {
   
    const navigate = useNavigate();

    return (
        <div className={`${isSidebarOpen ? 'col-md-9' : 'col-md-5'} mb-4 ms-4 bg-white p-0`}>
            <div className="shadow" onClick={() => navigate(`/job-details/${job.id}`)} style={{ cursor: 'pointer' }}>
                <div className="d-flex justify-content-between border-bottom p-3">
                    <h3 className="card-title text-capitalize text-truncate">
                        {job.job_name}
                    </h3>
                    {isApplied ?( <p className="card-title text-capitalize fst-italic text-muted p-0 fw-bolder ms-3">{status}</p>):
                    ( <p className="card-title text-capitalize fst-italic text-muted p-0 fw-bolder ms-3">{job?.company?.location}</p>)
                }
                   
                    
                </div>
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between">
                        <p className="card-text text-capitalize">{job?.company?.name}</p>
                        <p className="card-text text-capitalize">{job.salary}<span> Lpa</span></p>
                        <p className="card-text text-capitalize">{job.type}</p>
                    </div>
                    <p className="card-text truncate-two-lines">{job.job_description}</p>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="d-flex flex-row">
                            <p className="card-text text-capitalize m-0"><strong>Last Date :</strong></p>
                            <p className="card-text text-capitalize ms-2">{job.last_date}</p>
                        </div>
                        <p className="card-text text-capitalize">Experience:<strong>{job.experience}</strong></p>
                    </div>
                </div>
                {isApplied ? (
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-secondary w-100 rounded-0" disabled>Applied</button>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <button
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     onApplyClick && onApplyClick();
                            // }}
                            onClick={() => navigate(`/job-details/${job.id}`)}
                            className="btn btn-dark rounded-0 w-100"
                        >
                            Apply
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default JobCard;
