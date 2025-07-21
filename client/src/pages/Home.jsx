import React from "react";
import ProblemsList from "../pages/ProblemsList";
import { useAuth } from "../context/AuthContext";
// import AddProblemForm from "../components/AddProblemForm";

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>Online Judge</h1>
      {user ? (
        <>
          <h2>Welcome, {user.fullName}</h2>
          <p>Email: {user.email}</p>
          <hr style={{ margin: "2rem 0" }} />
        </>
      ) : null}
      <h1><a href="/leaderboard" className="font-red">go to leaderboard</a></h1>
    </>
  );
};

export default Home;
