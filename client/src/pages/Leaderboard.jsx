import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/leaderboard`, { withCredentials: true })
      .then(res => {
        // Sort users by score in descending order
        const sortedUsers = res.data.sort((a, b) => b.score - a.score);
        setUsers(sortedUsers);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div>
      <h3>leaderboard</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <strong>{user.fullName}</strong> — {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
