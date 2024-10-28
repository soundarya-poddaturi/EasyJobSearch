import React, { useEffect, useState } from 'react';
import ManageRecords from './ManageRecords';
import Address from './Address';
import ManageResume from './ManageResume'; // Import the new component

const UserProfile = ({ id }) => {
    const [userData, setUserData] = useState({
        personal_info: {},
        certificates: [],
        experiences: [],
        projects: [],
        education: [],
        resumes: [] // Add resumes to the state
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/profile/${id}/`);
                const data = await response.json();
                console.log(data);
                setUserData({
                    personal_info: data.personal_info,
                    certificates: data.certificates,
                    experiences: data.experiences,
                    projects: data.projects,
                    education: data.education,
                    resumes: data.resumes // Include resumes in the state
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const certificateFields = [
        { name: 'title', type: 'text', placeholder: 'Certificate Title', required: true },
        { name: 'description', type: 'text', placeholder: 'Description', required: false },
        { name: 'file_link', type: 'text', placeholder: 'File Link', required: false }
    ];

    const educationFields = [
        { name: 'institute_name', type: 'text', placeholder: 'Institute Name', required: true },
        { name: 'marks_or_grade', type: 'text', placeholder: 'Marks/Grade', required: false },
        { name: 'duration_from', type: 'date', placeholder: 'Start Date', required: false },
        { name: 'duration_to', type: 'date', placeholder: 'End Date', required: false }
    ];

    const experienceFields = [
        { name: 'employer', type: 'text', placeholder: 'Employer', required: true },
        { name: 'location', type: 'text', placeholder: 'Location', required: false },
        { name: 'role_title', type: 'text', placeholder: 'Role Title', required: true },
        { name: 'description', type: 'textarea', placeholder: 'Description', required: false },
        { name: 'duration_from', type: 'date', placeholder: 'Start Date', required: false },
        { name: 'duration_to', type: 'date', placeholder: 'End Date', required: false },
        { name: 'skills', type: 'text', placeholder: 'Skills', required: false }
    ];

    const projectFields = [
        { name: 'title', type: 'text', placeholder: 'Project Title', required: true },
        { name: 'description', type: 'text', placeholder: 'Description', required: false },
        { name: 'link', type: 'text', placeholder: 'Link', required: false },
        { name: 'skills', type: 'text', placeholder: 'Skills', required: false },
        { name: 'duration_from', type: 'date', placeholder: 'Start Date', required: false },
        { name: 'duration_to', type: 'date', placeholder: 'End Date', required: false }
    ];

    return (
        <div>
            <h1 className='text-muted'>Hello {userData.personal_info.first_name}!!</h1>
            <Address id={id} personalInfo={userData.personal_info} />
            <form onSubmit={handleSubmit} className='d-grid col-12'>

                <ManageResume
                    
                    
                    userId={id}
                />

                <ManageRecords
                    recordType="Certificate"
                    initialRecords={userData.certificates}
                    id={id}
                    apiEndpoint={`http://localhost:8000/api/certificate/manage/${id}`}
                    fields={certificateFields}
                />

                <ManageRecords
                    recordType="Education"
                    initialRecords={userData.education}
                    id={id}
                    apiEndpoint={`http://localhost:8000/api/education/manage/${id}`}
                    fields={educationFields}
                />

                <ManageRecords
                    recordType="Experience"
                    initialRecords={userData.experiences}
                    id={id}
                    apiEndpoint={`http://localhost:8000/api/experience/manage/${id}`}
                    fields={experienceFields}
                />

                <ManageRecords
                    recordType="Project"
                    initialRecords={userData.projects}
                    id={id}
                    apiEndpoint={`http://localhost:8000/api/project/manage/${id}`}
                    fields={projectFields}
                />
            </form>
        </div>
    );
};

export default UserProfile;
