import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);

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
    </div>
  );
};

export default ProblemsList;
