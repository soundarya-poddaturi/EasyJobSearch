import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageResume = ({ userId }) => {
    const [resume, setResume] = useState(null);      // Stores the resume data
    const [selectedFile, setSelectedFile] = useState(null); // Stores the file chosen for upload/edit
    const [loading, setLoading] = useState(false);         // Loading state for actions
    const [error, setError] = useState(null);              // Error message state

    // Fetch the resume when component mounts
    useEffect(() => {
        fetchResume();
    }, [userId]);

    const fetchResume = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/api/resume/${userId}/`);
            setResume(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load resume');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert('Please select a file to upload');
        
        const formData = new FormData();
        formData.append('pdf_file', selectedFile);

        try {
            setLoading(true);
            const response = resume
            console.log("first")
                ? await axios.put(`http://localhost:8000/api/resume/${userId}/`, formData)
                : await axios.post(`http://localhost:8000/api/resume/${userId}/`, formData);

            setResume(response.data);
            setSelectedFile(null);
            alert('Resume uploaded successfully');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload resume');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!resume) return alert('No resume to delete');
        
        try {
            setLoading(true);
            await axios.delete(`/api/resume/${userId}/`);
            setResume(null);
            alert('Resume deleted successfully');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-resume">
            <h3>Manage Resume</h3>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* Display existing resume */}
            {resume ? (
                <div>
                    <p>Current Resume:</p>
                    <a href={resume.pdf_file} target="_blank" rel="noopener noreferrer">
                        View Resume
                    </a>
                    <button className="btn btn-danger mx-2" onClick={handleDelete}>
                        Delete Resume
                    </button>
                </div>
            ) : (
                <p>No resume uploaded</p>
            )}

            {/* File input and upload/edit button */}
            <div className="mt-3">
                <input type="file" onChange={handleFileChange} />
                <button
                    className="btn btn-primary mx-2"
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                >
                    {resume ? 'Edit Resume' : 'Upload Resume'}
                </button>
            </div>
        </div>
    );
};

export default ManageResume;
