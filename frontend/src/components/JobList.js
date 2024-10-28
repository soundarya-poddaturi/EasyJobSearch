// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Login from './Login';  // Import the Login component
// import { useNavigate } from 'react-router-dom';

// function JobList() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedJobId, setSelectedJobId] = useState(null);  // Track which job is being applied for
//   const [answers, setAnswers] = useState({});  // Track answers to questions
//   const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if the user is logged in
//   const [userEmail, setUserEmail] = useState('');  // Store the logged-in user's email
//   const [showLogin, setShowLogin] = useState(false);  // Track whether to show login form
//   const navigate=useNavigate();
//   useEffect(() => {
//     // Fetch the job list
//     axios.get('http://127.0.0.1:8000/company/list_jobs/')
//       .then(response => {
//         setJobs(response.data);
//         console.log(response.data[0])
//         setLoading(false);
//       })
//       .catch(error => {
//         setError('Error fetching jobs');
//         setLoading(false);
//       });

//     // Check if the user is already logged in
//     const storedEmail = localStorage.getItem('userEmail');
//     if (storedEmail) {
//       setIsLoggedIn(true);
//       setUserEmail(storedEmail);
//     }
//   }, []);

//   // Function to handle job application
//   const handleApply = (jobId) => {
//     // Check if the user is logged in
//     const storedEmail = localStorage.getItem('student_id');
//     if (storedEmail) {
//       setIsLoggedIn(true);
//       setSelectedJobId(jobId);  // Proceed with applying if logged in
//     } else {
//       navigate('/login')
//     }
//   };

//   // Function to handle answer change
//   const handleAnswerChange = (questionId, value) => {
//     setAnswers({
//       ...answers,
//       [questionId]: value
//     });
//   };


// const handleSubmitApplication = (jobId) => {
//   const studentId = localStorage.getItem('student_id');  // Get the student ID from local storage

//   if (!studentId) {
//     alert("Please log in to apply for jobs.");
//     return;
//   }


//   const answerData = {
//     student_id: studentId,
//     job_id: jobId,
//     answers: Object.entries(answers).map(([questionId, answerText]) => ({
//       question: parseInt(questionId),
//       answer_text: answerText,
//     })),
//   };
//   console.log(answerData);
//   axios.post('http://localhost:8000/company/create_application/', answerData)
//     .then(response => {
//       alert(`Successfully applied for job: ${jobId}`);
//       setSelectedJobId(null);  // Reset the selected job after submission
//       setAnswers({});  // Clear the answers
//     })
//     .catch(error => {
//       alert(`Error applying for job: ${jobId}`);
//     });
// };


//   const handleLogin = (email) => {
//     localStorage.setItem('userEmail', email);
//     setIsLoggedIn(true);
//     setUserEmail(email);
//     setShowLogin(false);  
//   };

//   if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <div className="container mt-5">
//       <h2>Job List</h2>
//       {showLogin && (
//         <div className="mb-4">
//           <h4>Please Login to Apply for Jobs</h4>
//           <Login onLogin={handleLogin} />
//         </div>
//       )}
//       {jobs.length > 0 ? (
//         <div className="row">
//           {jobs.map(job => (
//             <div key={job.id} className="col-md-6 mb-4">
//               <div className="card">
//                 <div className="card-body">
//                   <h3 className="card-title">{job.job_name} <span className="badge bg-secondary">{job.job_role}</span></h3>
//                   <h5 className="card-subtitle mb-2 text-muted">
//                     {job.company.name} - {job.company.location}
//                   </h5>
//                   <p className="card-text">{job.job_description}</p>
//                   <p className="card-text"><strong>Last Date to Apply:</strong> {job.last_date}</p>

//                   {/* Apply Button */}
                  
//                   <button 
//                     onClick={() => handleApply(job.id)} 
//                     className="btn btn-primary mb-3"
//                   >
//                     {selectedJobId === job.id ? 'Cancel' : 'Apply'}
//                   </button>

//                   {/* Conditionally show the questions and text field when the user applies and is logged in */}
//                   {selectedJobId === job.id && isLoggedIn && (
//                     <div>
//                       <h5>Answer the following questions:</h5>
//                       <ul className="list-group mb-3">
//                         {job.questions.map((question) => (
//                           <li key={question.id} className="list-group-item">
//                             <p>{question.question_text}</p>
//                             <input 
//                               type="text" 
//                               placeholder="Your answer" 
//                               value={answers[question.id] || ''} 
//                               onChange={(e) => handleAnswerChange(question.id, e.target.value)} 
//                               className="form-control mb-2"
//                             />
//                           </li>
//                         ))}
//                       </ul>
//                       <button 
//                         onClick={() => handleSubmitApplication(job.id)} 
//                         className="btn btn-success"
//                       >
//                         Submit Application
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No jobs found.</p>
//       )}
//     </div>
//   );
// }

// export default JobList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';  // Import the Login component
import { useNavigate } from 'react-router-dom';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState(localStorage.getItem('student_id'));  // Track student ID
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the job list
    axios.get('http://127.0.0.1:8000/company/list_jobs/')
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching jobs');
        setLoading(false);
      });

    // Check if the user is already logged in
    const storedStudentId = localStorage.getItem('student_id');
    if (storedStudentId) {
      setIsLoggedIn(true);
      setStudentId(storedStudentId);
    }
  }, []);

  const handleApply = (jobId) => {
    if (studentId) {
      setIsLoggedIn(true);
      setSelectedJobId(jobId);
    } else {
      navigate('/login');
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  // Submit application with answers
  const handleSubmitApplication = (jobId) => {
    // Format answers to use "question_id" key as required by the backend
    const formattedAnswers = Object.keys(answers).map(questionId => ({
      question_id: parseInt(questionId),
      answer_text: answers[questionId],
    }));
    console.log({
      student_id: studentId,
      job_id: jobId,
      answers: formattedAnswers
    })
    axios.post(`http://localhost:8000/company/create_application/`, {
      student_id: studentId,
      job_id: jobId,
      answers: formattedAnswers
    })
    .then(response => {
      alert(`Successfully applied for job: ${jobId}`);
      setSelectedJobId(null);
      setAnswers({});
    })
    .catch(error => {
      alert(`Error applying for job: ${jobId}`);
    });
};


  const handleLogin = (email, studentId) => {
    localStorage.setItem('student_id', studentId);
    setIsLoggedIn(true);
    setStudentId(studentId);
    setShowLogin(false);
  };

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>Job List</h2>
      {showLogin && (
        <div className="mb-4">
          <h4>Please Login to Apply for Jobs</h4>
          <Login onLogin={handleLogin} />
        </div>
      )}
      {jobs.length > 0 ? (
        <div className="row">
          {jobs.map(job => (
            <div key={job.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">{job.job_name} <span className="badge bg-secondary">{job.job_role}</span></h3>
                  <h5 className="card-subtitle mb-2 text-muted">
                    {job.company.name} - {job.company.location}
                  </h5>
                  <p className="card-text">{job.job_description}</p>
                  <p className="card-text"><strong>Last Date to Apply:</strong> {job.last_date}</p>

                  {/* Apply Button */}
                  <button 
                    onClick={() => handleApply(job.id)} 
                    className="btn btn-primary mb-3"
                  >
                    {selectedJobId === job.id ? 'Cancel' : 'Apply'}
                  </button>

                  {/* Show questions and input fields */}
                  {selectedJobId === job.id && isLoggedIn && (
                    <div>
                      <h5>Answer the following questions:</h5>
                      <ul className="list-group mb-3">
                        {job.questions.map((question) => (
                          <li key={question.id} className="list-group-item">
                            <p>{question.question_text}</p>
                            <input 
                              type="text" 
                              placeholder="Your answer" 
                              value={answers[question.id] || ''} 
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)} 
                              className="form-control mb-2"
                            />
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => handleSubmitApplication(job.id)} 
                        className="btn btn-success"
                      >
                        Submit Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}

export default JobList;