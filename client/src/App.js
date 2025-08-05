import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import { AuthProvider } from "./context/AuthContext";
import Home from './pages/Home.jsx';
import AddProblemForm from './components/AddProblemForm';
import ProblemsList from "./pages/ProblemsList.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Contest from "./pages/Contest.jsx";
import Personal from "./pages/Personal.jsx";
import Signin from "./pages/Signin.jsx";
import ProblemDetails from "./pages/ProblemDetails.jsx";
import RunCodePage from "./pages/RunCodePage.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className=" text-white"
         style={{ backgroundColor: '#20201E' }}
         >
          <Navbar className="fixed top-0 left-0 w-full z-50" />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-problem" element={<AddProblemForm />} />
              <Route path="/all-problems" element={<ProblemsList/>} />
              <Route path="/leaderboard" element={<Leaderboard/>} />            
              <Route path="/contest" element={<Contest/>} />
              <Route path="/personal" element={<Personal/>} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/problems/:id" element={<ProblemDetails />} />
              <Route path="/run" element={<RunCodePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
