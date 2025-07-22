import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/leaderboard`, {
        withCredentials: true,
      })
      .then(res => {
        // Sort users by score descending
        const sorted = res.data.sort((a, b) => b.score - a.score);
        setUsers(sorted);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white py-12 px-4 md:px-16" style={{ backgroundColor: '#20201E' }}>
      <div className="max-w-2xl mx-auto" style={{ paddingTop: "5rem" }}>
        <h1 className="text-4xl font-bold mb-8 mt-20">🏆 Leaderboard</h1>

        <div className="overflow-x-auto bg-[#0f0f10] rounded-lg shadow-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#27272a]">
                <th className="px-6 py-4 text-left text-lg font-semibold uppercase">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-lg font-semibold uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-right text-lg font-semibold uppercase">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <hr className="border-t border-gray-700" />
                </td>
              </tr>
              {users.map((user, idx) => (
                <tr
                  key={user._id}
                  className={idx % 2 === 0 ? 'bg-[#1f1f23]' : 'bg-[#232327]'}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-lg">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-lg">
                    {user.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="text-center text-gray-400 mt-8 text-lg">
            No data to display yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
