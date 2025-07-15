import React from "react";
import ProblemsList from "./pages/ProblemsList";
import AddProblemForm from './components/AddProblemForm';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h1>Online Judge</h1>
        <ProblemsList />
        {user ? (
          <>
            <h2>Welcome, {user.fullName}</h2>
            <p>Email: {user.email}</p>
            <hr style={{ margin: "2rem 0" }} />
            {user.role === "admin" && <AddProblemForm />}
          </>
        ) : null}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
