import React, { useEffect, useState } from 'react';
import Projects from './Projects';
import Education from './Education';
import Certificates from './Certificate';
import Address from './Address';
import Experience from './Experience';

const UserProfile = ({ email }) => {
    const [userData, setUserData] = useState({
        address: {},
        certificates: [],
        experiences: [],
        projects: [],
        education: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/profile/${email}/`);
                const data = await response.json();
                console.log(data.education)
                setUserData({
                    address: {
                        address_line_1: data.address_line_1,
                        city: data.city,
                        state: data.state,
                        pincode: data.pincode
                    },
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
    }, [email]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission (e.g., send data to the server)
        console.log(userData);
    };

    return (
        <div>
            <h1>User Profile for {email}</h1>

            <form onSubmit={handleSubmit}>
                <Address address={userData.address} email={email}/>
                <Experience experiences={userData.experiences} email={email} />
                <Education education={userData.education} email={email}/>
                <Projects projects={userData.projects} email={email}/>
                <Certificates certificates={userData.certificates} email={email}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UserProfile;
