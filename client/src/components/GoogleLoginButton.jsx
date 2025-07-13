import React from 'react';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
