// import React, { useEffect, useState } from 'react';
// import Projects from './Projects';
// import Education from './Education';
// import Certificates from './Certificate';
// import Address from './Address';
// import Experience from './Experience';

// const UserProfile = ({ id }) => {
//     const [userData, setUserData] = useState({
//         address: {},
//         certificates: [],
//         experiences: [],
//         projects: [],
//         education: []
//     });

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8000/api/profile/${id}/`);
//                 const data = await response.json();
//                 console.log(data.address)
//                 setUserData({
//                     address: data.address,
//                     certificates: data.certificates,
//                     experiences: data.experiences,
//                     projects: data.projects,
//                     education: data.education
//                 });
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         };

//         fetchData();
//     }, [id]);

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         // Handle form submission (e.g., send data to the server)
//         console.log(userData);
//     };

//     return (
//         <div>
//             <h1>User Profile for {id}</h1>

//             <form onSubmit={handleSubmit}>
//                 <Address address={userData.address} id={id}/>
//                 <Experience experiences={userData.experiences} id={id} />
//                 <Education education={userData.education} id={id}/>
//                 <Projects projects={userData.projects} id={id}/>
//                 <Certificates certificates={userData.certificates} id={id}/>
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// };

// export default UserProfile;
import React, { useEffect, useState } from 'react';
import ManageRecords from './ManageRecords';
import Address from './Address';


const UserProfile = ({ id }) => {
    const [userData, setUserData] = useState({
        email:"",
        address: {},
        certificates: [],
        experiences: [],
        projects: [],
        education: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/profile/${id}/`);
                const data = await response.json();
                console.log(data)
                setUserData({
                    email:data.email,
                    address: data.address,
                    certificates: data.certificates,
                    experiences: data.experiences,
                    projects: data.projects,
                    education: data.education
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission (e.g., send data to the server)
        console.log(userData);
    };

    const certificateFields = [
        { name: 'title', type: 'text', placeholder: 'Certificate Title' },
        { name: 'description', type: 'text', placeholder: 'Description' },
        { name: 'file_link', type: 'text', placeholder: 'File Link' }
    ];

    const educationFields = [
        { name: 'institute_name', type: 'text', placeholder: 'Institute Name' },
        { name: 'duration_from_year', type: 'number', placeholder: 'From Year' },
        { name: 'duration_from_month', type: 'number', placeholder: 'From Month' },
        { name: 'duration_to_year', type: 'number', placeholder: 'To Year' },
        { name: 'duration_to_month', type: 'number', placeholder: 'To Month' },
        { name: 'marks_or_grade', type: 'text', placeholder: 'Marks/Grade' }
    ];
    const experienceFields = [
        { name: 'employer', type: 'text', placeholder: 'Employer' },
        { name: 'location', type: 'text', placeholder: 'Location' },
        { name: 'role_title', type: 'text', placeholder: 'Role Title' },
        { name: 'duration_from_year', type: 'number', placeholder: 'From Year' },
        { name: 'duration_from_month', type: 'number', placeholder: 'From Month' },
        { name: 'duration_to_year', type: 'number', placeholder: 'To Year' },
        { name: 'duration_to_month', type: 'number', placeholder: 'To Month' },
        { name: 'description', type: 'textarea', placeholder: 'Description' },
        { name: 'skills', type: 'text', placeholder: 'Skills' }
    ];
    const projectFields = [
        { name: 'title', type: 'text', placeholder: 'Project Title' },
        { name: 'description', type: 'text', placeholder: 'Description' },
        { name: 'link', type: 'text', placeholder: 'Link' },
        { name: 'duration_from_year', type: 'number', placeholder: 'From Year' },
        { name: 'duration_from_month', type: 'number', placeholder: 'From Month' },
        { name: 'duration_to_year', type: 'number', placeholder: 'To Year' },
        { name: 'duration_to_month', type: 'number', placeholder: 'To Month' },
        { name: 'skills', type: 'text', placeholder: 'Skills' }
    ];
        

    return (
        <div>
            <h1 className='text-muted'>Hello {userData.email} !!</h1>
            <Address/>
            <form onSubmit={handleSubmit} className='d-grid col-12'>
                {/* Manage certificates using the generic ManageRecords component */}
                <ManageRecords
                    recordType="Certificate"
                    initialRecords={userData.certificates}
                    id={id}
                    apiEndpoint="http://localhost:8000/api/certificate/manage"
                    fields={certificateFields}
                />

                {/* Manage education using the generic ManageRecords component */}
                <ManageRecords
                    recordType="Education"
                    initialRecords={userData.education}
                    id={id}
                    apiEndpoint="http://localhost:8000/api/education/manage"
                    fields={educationFields}
                />
                <ManageRecords
                    recordType="Experience"
                    initialRecords={userData.experiences}
                    id={id}
                    apiEndpoint="http://localhost:8000/api/experience/manage"
                    fields={experienceFields}
                />
                <ManageRecords
                    recordType="Project"
                    initialRecords={userData.projects}
                    id={id}
                    apiEndpoint="http://localhost:8000/api/project/manage"
                    fields={projectFields}
                />



                {/* You can add similar ManageRecords calls for address, experiences, and projects */}
                {/* <button type="submit">Submit</button> */}
            </form>
        </div>
    );
};

export default UserProfile;
