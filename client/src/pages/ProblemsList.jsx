import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TAG_OPTIONS } from "../constants/tagOptions";
import Select from "react-select";

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/problems`, {
        withCredentials: true,
      })
      .then((res) => setProblems(res.data))
      .catch((err) => console.error("Error fetching problems:", err));
  }, []);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProblems =
    selectedTags.length > 0
      ? problems.filter((problem) =>
          problem.tags?.some((tag) =>
            selectedTags.map((t) => t.value).includes(tag)
          )
        )
      : problems;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#38bdf8"; // blue
      case "Medium":
        return "#facc15"; // yellow
      case "Hard":
        return "#f87171"; // red
      default:
        return "#aaa";
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "16px" : "20px",
  };

  const sidebarStyle = {
    width: isMobile ? "100%" : "30%",
    position: isMobile ? "static" : "sticky",
    top: isMobile ? "auto" : "32px",
    height: isMobile ? "auto" : "fit-content",
  };

  const listStyle = {
    width: isMobile ? "100%" : "70%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#20201E",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: "24px",
          marginBottom: "24px",
        }}
      >
        Available Problems
      </h2>

      <div style={containerStyle}>
        {/* Sidebar Filter */}
        <div style={sidebarStyle}>
          <label
            style={{
              color: "#aaa",
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Filter by Tags
          </label>
          <Select
            options={TAG_OPTIONS}
            isMulti
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Choose tags…"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#131313",
                borderColor: "#444",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#333",
                color: "#ddd",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#131313",
                color: "#fff",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#333" : "#131313",
                color: "#fff",
              }),
            }}
          />
        </div>

        {/* Problem List */}
        <div style={listStyle}>
          {filteredProblems.map((p, i) => (
            <Link
              key={p._id}
              to={`/problems/${p._id}`}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                backgroundColor: "#131313",
                padding: "16px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              {/* Title */}
              <div
                style={{
                  width: isMobile ? "100%" : "33%",
                  marginBottom: isMobile ? "8px" : "0",
                  fontWeight: 500,
                }}
              >
                {i + 1}. {p.title}
              </div>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  // gap: "6px",
                  width: isMobile ? "100%" : "50%",
                  paddingLeft : isMobile ? "0" : "0rem",
                  marginBottom: isMobile ? "8px" : "0",
                }}
              >
                {p.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "#333",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#ddd",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Difficulty */}
              <div
                style={{
                  width: isMobile ? "100%" : "6%",
                  textAlign: isMobile ? "left" : "right",
                  fontWeight: "bold",
                  color: getDifficultyColor(p.difficulty),
                }}
              >
                {p.difficulty}
              </div>
            </Link>
          ))}

          {filteredProblems.length === 0 && (
            <p
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              No problems match the selected tag(s).
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;
