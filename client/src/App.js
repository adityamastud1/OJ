import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleLoginButton from './components/GoogleLoginButton';

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
        </div>
      ) : (
        <GoogleLoginButton />
      )}
    </div>
  );
}

export default App;
