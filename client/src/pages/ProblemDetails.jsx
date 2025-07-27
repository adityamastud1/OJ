import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import CodeEditor from "../components/CodeEditor";
import { useAuth } from "../context/AuthContext";
import remarkGfm from "remark-gfm";
const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your solution here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stdin, setStdin] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [verdicts, setVerdicts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [showAIReview, setShowAIReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleRun = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COMPILER_URL}/compile`,
        { code, stdin, language }
      );
      setOutput(response.data.output);
    } catch (err) {
      setOutput(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      setVerdicts(["Error: Please login to submit."]);
      return;
    }
    setSubmitting(true);
    setVerdicts([]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setVerdicts(["Error: Please login to submit."]);
        setSubmitting(false);
        return;
      }

      // Axios config needs to have a `headers` object
      const config = {
        withCredentials: true, // keep this for your OAuth users
        headers: {}, // this is where we’ll put the JWT header
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/submit/${id}`,
        { language, code },
        config
      );

      setVerdicts(response.data.verdicts || []);
    } catch (err) {
      setVerdicts([
        "Error: " + (err.response?.data?.error || "Submission failed."),
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/problems/${id}`, {
        withCredentials: true,
      })
      .then((res) => setProblem(res.data))
      .catch((err) => console.error("Error fetching problem:", err));
  }, [id]);

  useEffect(() => {
    const fetchReview = async () => {
      setReviewLoading(true);
      setAiFeedback("");
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/aireview/review`,
          { code }
        );
        setAiFeedback(response.data.feedback);
      } catch (err) {
        setAiFeedback(
          "Error: " +
            (err.response?.data?.error || "Failed to fetch AI review.")
        );
      } finally {
        setReviewLoading(false);
      }
    };

    if (showAIReview) {
      fetchReview();
    }
  }, [showAIReview, code]);

  if (!problem)
    return <p className="text-white text-center mt-10">Loading...</p>;
  // Filter visible testcases
  const visibleTCs = problem.testcases?.filter((tc) => !tc.hidden) || [];

  return (
    <>
      <div
        className="flex h-screen text-white"
        style={{ backgroundColor: "#20201E" }}
      >
        {/* Left side: Problem description + visible testcases */}
        <div className="w-1/2 overflow-y-auto px-8 py-6 border-r border-gray-700 mb-2">
          <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
          <p
            className={`inline-block text-sm font-medium px-2 py-1 rounded ${
              problem.difficulty === "Easy"
                ? "bg-green-800 text-green-300"
                : problem.difficulty === "Medium"
                ? "bg-yellow-700 text-yellow-200"
                : "bg-red-800 text-red-300"
            }`}
          >
            {problem.difficulty}
          </p>

          <div className="mt-6 space-y-5 prose prose-invert max-w-none">
            <section>
              <h2 className="text-xl font-semibold">Description</h2>
              <ReactMarkdown>{problem.description}</ReactMarkdown>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Input Format</h2>
              <ReactMarkdown>{problem.inputFormat}</ReactMarkdown>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Output Format</h2>
              <ReactMarkdown>{problem.outputFormat}</ReactMarkdown>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Constraints</h2>
              <ReactMarkdown>{problem.constraints}</ReactMarkdown>
            </section>

            {visibleTCs.length > 0 && (
              <section>
                {visibleTCs.map((tc, idx) => (
                  <div className="space-y-4 mb-6">
                    <div key={idx} className="bg-[#0f0f0f] p-4 rounded">
                      <h2 className="font-semibold mb-2">Example {idx + 1}</h2>
                      <p>
                        <strong>Input:</strong>
                      </p>
                      <pre className="bg-[#1a1a1a] p-2 rounded">{tc.input}</pre>
                      <p className="mt-2">
                        <strong>Output:</strong>
                      </p>
                      <pre className="bg-[#1a1a1a] p-2 rounded">
                        {tc.output}
                      </pre>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>

        {/* Right side: Editor, Input, Output */}
        <div className="w-1/2 bg-[#434242] px-6 py-6 overflow-y-auto space-y-6">
          {/* Editor Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Code Editor</h2>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-white font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#0f0f0f] border border-gray-700 text-white rounded px-3 py-1"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex gap-4 mt-2">
              {user ? (
                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white font-semibold py-2 px-4 rounded-md shadow"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    onClick={() => setShowAIReview(true)}
                    className="bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-2 px-4 rounded-md shadow"
                  >
                    Get AI Review
                  </button>
                </div>
              ) : (
                <p className="text-yellow-300 mt-2">
                  Please{" "}
                  <a href="/signin" className="underline text-blue-300">
                    log in
                  </a>{" "}
                  to submit your solution.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-gray-700 bg-[#0f0f0f] shadow-md">
              <CodeEditor code={code} setCode={setCode} language={language} />
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <h3 className="text-white font-semibold mb-2">Custom Input</h3>
            <textarea
              className="w-full p-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white shadow-inner resize-y"
              rows={4}
              placeholder="Enter input (stdin)..."
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            />
            <div>
              {user ? (
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-800 disabled:opacity-60 transition-colors text-white font-semibold py-2 px-4 rounded-md shadow"
                >
                  {loading ? "Running..." : "Run on custom input"}
                </button>
              ) : (
                <p>
                  Please{" "}
                  <a
                    href="/signin"
                    className="underline text-blue-300 hover:text-blue-700"
                  >
                    log in
                  </a>{" "}
                  to run custom input.
                </p>
              )}
            </div>
          </div>

          {/* Output */}
          <div>
            <h3 className="text-white font-semibold mb-9">Output</h3>
            <pre className="w-full p-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-gray-200 whitespace-pre-wrap shadow-inner resize-y">
              {output}
            </pre>
          </div>
          {verdicts.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2 mt-6">
                Submission Verdicts
              </h3>
              <ul className="space-y-1">
                {verdicts.map((v, idx) => (
                  <li
                    key={idx}
                    className={`p-2 rounded ${
                      v === "Passed"
                        ? "bg-green-800 text-green-200"
                        : v === "Failed"
                        ? "bg-red-800 text-red-200"
                        : "bg-yellow-700 text-yellow-100"
                    }`}
                  >
                    Testcase {idx + 1}:{" "}
                    {v === "Passed"
                      ? "Passed ✅"
                      : v === "Failed"
                      ? "Failed ❌"
                      : v}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showAIReview && (
            <div className="fixed top-0 right-0 w-1/3 h-full bg-[#1f1f1f] text-white z-50 p-6 border-l border-gray-700 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AI Code Review</h2>
                <button
                  onClick={() => setShowAIReview(false)}
                  className="text-red-400 font-semibold text-sm"
                >
                  Close ❌
                </button>
              </div>
              {reviewLoading ? (
                <p className="text-gray-400">Generating AI feedback...</p>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{aiFeedback}</pre>
              )}
            </div>
          )}
        </div>
      </div>
      {showAIReview && (
        <>
          {/* === BACKDROP === */}
          <div
            onClick={() => setShowAIReview(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          />

          {/* === MODAL === */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "40vw",
              maxWidth: "600px",
              maxHeight: "80vh",
              backgroundColor: "#1f1f1f",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
              overflowY: "auto",
              zIndex: 1000,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, color: "#fff", fontSize: "1.25rem" }}>
                AI Code Review
              </h2>
              <button
                onClick={() => setShowAIReview(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f88",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>

            {/* Body */}
            {reviewLoading ? (
              <p style={{ color: "#aaa", marginTop: "1rem" }}>
                Generating AI feedback…
              </p>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2
                        style={{ color: "#fff", marginTop: "1rem" }}
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        style={{
                          color: "#ddd",
                          lineHeight: 1.5,
                          margin: "0.5rem 0",
                        }}
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        style={{
                          color: "#ddd",
                          margin: "0.25rem 0 0.25rem 1rem",
                        }}
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong style={{ color: "#fff" }} {...props} />
                    ),
                  }}
                >
                  {aiFeedback}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
//
export default ProblemDetails;
