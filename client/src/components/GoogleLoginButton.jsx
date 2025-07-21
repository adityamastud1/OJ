import React from 'react';
import googleLogo from '../assets/google-logo.png';
const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self");
  };

  return (
    <button onClick={handleLogin}  className="flex items-center gap-3 w-full justify-center bg-white text-gray-700 py-2 px-4 rounded shadow hover:bg-gray-200 transition">
      <img src={googleLogo} alt="Google" className="w-5 h-5" />
      <span className="font-medium">Login with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
