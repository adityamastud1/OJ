import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/problems`, { withCredentials: true })
      .then(res => setProblems(res.data))
      .catch(err => console.error('Error fetching problems:', err));
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-teal-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white py-8 px-4 md:px-16">
      <h2 className="text-2xl font-semibold mb-6">Available Problems</h2>
      <div className="space-y-2">
        {problems.map((problem, index) => (
          <Link
            to={`/problems/${problem._id}`}
            key={problem._id}
            className="flex items-center justify-between bg-[#1c1c1c] hover:bg-[#2a2a2a] rounded-md px-4 py-3 transition duration-200"
          >
            <span className="font-medium text-white">
              {index + 1}. {problem.title}
            </span>
            <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemsList;
