import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleLoginButton from './components/GoogleLoginButton';
import ProblemsList from './pages/ProblemsList'; // Moved it to components for now

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/login/success", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Online Judge</h1>

      {user ? (
        <div>
          <h2>Welcome, {user.fullName}</h2>
          <p>Email: {user.email}</p>

          <hr style={{ margin: "2rem 0" }} />

          {/* 👇 Show problems if logged in */}
          <ProblemsList />
        </div>
      ) : (
        <GoogleLoginButton />
      )}
    </div>
  );
}

export default App;
