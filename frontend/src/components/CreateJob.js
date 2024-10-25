import React, { useState } from 'react';
import axios from 'axios';

const CreateJob = ({id}) => {
    // console.log(id);
    const [jobId, setJobId] = useState('');
    const [jobName, setJobName] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [companyId, setCompanyId] = useState(''); // Changed from company name to company ID
    const [jobDescription, setJobDescription] = useState('');
    const [lastDate, setLastDate] = useState('');
    const [questions, setQuestions] = useState([{ question_text: '' }]); // Array to manage questions
    const [message, setMessage] = useState('');

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question_text = value;
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question_text: '' }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        setCompanyId(id)
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/company/create_job/', {
               
                job_name: jobName,
                job_role: jobRole,
                company_id: companyId, // Use company ID
                job_description: jobDescription,
                last_date: lastDate,
                questions: questions,
            });
            setMessage('Job created successfully!');
            // Clear the form
            setJobId('');
            setJobName('');
            setJobRole('');
            setCompanyId('');
            setJobDescription('');
            setLastDate('');
            setQuestions([{ question_text: '' }]);
        } catch (error) {
            setMessage('Failed to create job. Please try again.');
        }
    };

    return (
        <div className="container m-5 mt-5">
            <h1 className="mb-4">Create Job</h1>
            <form onSubmit={handleSubmit}>
                {/* <div className="mb-3">
                    <label className="form-label">Job ID</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Job ID" 
                        value={jobId} 
                        onChange={(e) => setJobId(e.target.value)} 
                        required 
                    />
                </div> */}
                <div className="mb-3">
                    <label className="form-label">Job Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Job Name" 
                        value={jobName} 
                        onChange={(e) => setJobName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Job Role</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Job Role" 
                        value={jobRole} 
                        onChange={(e) => setJobRole(e.target.value)} 
                        required 
                    />
                </div>
                {/* <div className="mb-3">
                    <label className="form-label">Company ID</label>
                    <input 
                        type="number"  // Changed to number for company ID
                        className="form-control" 
                        placeholder="Company ID" 
                        value={companyId} 
                        onChange={(e) => setCompanyId(e.target.value)} 
                        required 
                    />
                </div> */}
                <div className="mb-3">
                    <label className="form-label">Job Description</label>
                    <textarea 
                        className="form-control" 
                        placeholder="Job Description" 
                        value={jobDescription} 
                        onChange={(e) => setJobDescription(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Date to Apply</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        value={lastDate} 
                        onChange={(e) => setLastDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className='d-flex flex-row justify-content-around gap-5'>
                <h3>Questions</h3>
                <button 
                    type="button" 
                    className="btn btn-link mb-3" 
                    onClick={handleAddQuestion}
                >
                    Add +
                </button>
                </div>
                {questions.map((question, index) => (
                    <div key={index} className="mb-3">
                        <label className="form-label">{`Question ${index + 1}`}</label>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder={`Question ${index + 1}`} 
                                value={question.question_text} 
                                onChange={(e) => handleQuestionChange(index, e.target.value)} 
                                required 
                            />
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={() => handleRemoveQuestion(index)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                
                <div>
                <button type="submit" className="btn btn-primary">Create Job</button>
                </div>
            </form>
            {message && <p className="mt-4 alert alert-info">{message}</p>}
        </div>
    );
};

export default CreateJob;
