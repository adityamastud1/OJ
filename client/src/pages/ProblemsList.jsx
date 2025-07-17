import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
// import AddProblemForm from "../components/AddProblemForm";
import AddProblemForm from "../components/AddProblemForm";
  
const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    axios.get('http://localhost:5000/problems', { withCredentials: true })
      .then(res => setProblems(res.data))
      .catch(err => console.error('Error fetching problems:', err));
  }, []);

  return (
    <div>
      <h3>Available Problems</h3>
      <ul>
        {problems.map(problem => (
          <li key={problem._id}>
            <strong>{problem.title}</strong> — {problem.difficulty}
          </li>
        ))}
      </ul>
      <ul>
        {user && user.role === 'admin' && (
          <AddProblemForm />
        )}

      </ul>
    </div>
  );
};

export default ProblemsList;
