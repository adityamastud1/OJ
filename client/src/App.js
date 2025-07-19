import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import { AuthProvider } from "./context/AuthContext";
import Home from './pages/Home.jsx';
import AddProblemForm from './components/AddProblemForm';
import ProblemsList from "./pages/ProblemsList.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import About from "./pages/About.jsx";
import Contest from "./pages/Contest.jsx";
import Personal from "./pages/Personal.jsx";
import Signin from "./pages/Signin.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ padding: "2rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-problem" element={<AddProblemForm />} />
            <Route path="/all-problems" element={<ProblemsList/>} />
            <Route path="/leaderboard" element={<Leaderboard/>} />            
            <Route path="/contest" element={<Contest/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/personal" element={<Personal/>} />
            <Route path="/signin" element={<Signin />} />
            {/* You can add more routes here, like /contests, /about, etc. */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
