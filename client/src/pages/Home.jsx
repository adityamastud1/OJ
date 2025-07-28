import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const { user } = useAuth();
  // const [stats, setStats] = useState({ solved: 0, submissions: 0 });
  const [daily, setDaily] = useState(null);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    if (user) {
      // axios.get("/api/stats").then(res => setStats(res.data));
      // axios.get("/api/daily-challenge").then(r => setDaily(r.data));
      // axios.get("/api/problems?limit=5").then(r => setPreview(r.data));
    }
  }, [user]);

  return (
    <div
      className="min-h-screen bg-blue-900 text-white"
      style={{ backgroundColor: "#20201E" }}
    >
      {/* Hero */}
      <section className="relative bg-[url('/hero-bg.jpg')] bg-cover bg-center py-24 px-8 text-center">
        <div className="backdrop-brightness-50 p-12 rounded-xl inline-block">
          {user ? (
            <h1
              className="font-bold"
              style={{
                fontSize: "4rem",
                marginBottom: "0rem",
                marginTop: "3rem",
              }}
            >
              Hello{" "}
              <span style={{ color: "red" }}>
                {user?.fullName?.split(" ")[0] || "Guest"}
              </span>
            </h1>
          ) : (
            <span className="mt-4" style={{ marginTop: "5rem" }}></span>
          )}
          <h1 className="font-bold mb-4 mt-[5rem]" style={{ fontSize: "4rem" }}>
            Sharpen Your Algorithms
          </h1>
          <p className="text-lg mb-6">
            Solve problems, run code, and climb the leaderboard.
          </p>
          <Link
            to="/all-problems"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-xl font-semibold transition"
          >
            Start Solving →
          </Link>
        </div>
      </section>

      <div className="px-8 py-12 space-y-16">
        {/* User Stats & Daily Challenge */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Stats */}
          {user && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "24px",
                width: "100%",
                marginBottom: "8rem",
              }}
            >
              <div className="bg-[#252531] p-6 rounded-lg text-center shadow">
                <h3 className="text-sm text-gray-400">Problems Solved</h3>
                <p className="text-3xl font-bold">{user.totalSolved}</p>
              </div>
              <div className="bg-[#252531] p-6 rounded-lg text-center shadow">
                <h3 className="text-sm text-gray-400">Total Submissions</h3>
                <p className="text-3xl font-bold">{user.totalSubmissions}</p>
              </div>
              <div className="bg-[#252531] p-6 rounded-lg text-center shadow">
                <h3 className="text-sm text-gray-400">Total score</h3>
                <p className="text-3xl font-bold">{user.score}</p>
              </div>
            </div>
          )}

          {/* Daily Challenge */}
          {daily && (
            <div className="flex-1 bg-[#252531] rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">🔥 Daily Challenge</h3>
              <p className="text-gray-300 mb-4">{daily.title}</p>
              <Link
                to={`/problems/${daily._id}`}
                className="text-blue-500 hover:underline font-medium"
              >
                Solve Now →
              </Link>
            </div>
          )}
        </div>

        {/* Problem Preview Carousel */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🔥 Trending Problems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {preview.map((p) => (
              <Link
                key={p._id}
                to={`/all-problems/${p._id}`}
                className="bg-[#252531] p-4 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{p.difficulty}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#252531] p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">
              <a href = "/leaderboard" className="text-blue-500 hover:underline">
              Real-time Leaderboard
              </a>
            </h3>
            <p className="text-gray-400">
              Compete and climb up the ranks with your peers.
            </p>
          </div>
        </div>
      </div>

      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#20201F",
          color: "gray",
          textAlign: "center",
          padding: "1rem",
          fontSize: "0.875rem", // equivalent to Tailwind's text-sm
          zIndex: 50,
        }}
      >
        © 2025 Online Judge — Built by Aditya Mastud
      </footer>
    </div>
  );
}
