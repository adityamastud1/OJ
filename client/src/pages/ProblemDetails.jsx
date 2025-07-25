import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import CodeEditor from "../components/CodeEditor";

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

// const handleSubmit = async () => {
//   setSubmitting(true);
//   setVerdicts([]);

//   try {
//     const token = localStorage.getItem("token"); // JWT is stored here after login
//     const headers = {
//       // Send cookies for OAuth
//       withCredentials: true,
//     };

//     if (token) {
//       headers.Authorization = `Bearer ${token}`; // Add JWT header if present
//     }

//     const response = await axios.post(
//       `${process.env.REACT_APP_BACKEND_URL}/api/submit/${id}`,
//       { language, code },
//       {
//         ...headers,
//       }
//     );

//     setVerdicts(response.data.verdicts || []);
//   } catch (err) {
//     setVerdicts([
//       "Error: " + (err.response?.data?.error || "Submission failed."),
//     ]);
//   } finally {
//     setSubmitting(false);
//   }
// };

const handleSubmit = async () => {
  setSubmitting(true);
  setVerdicts([]);

  try {
    const token = localStorage.getItem("token");

    // Axios config needs to have a `headers` object
    const config = {
      withCredentials: true,  // keep this for your OAuth users
      headers: {}             // this is where we’ll put the JWT header
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

  if (!problem)
    return <p className="text-white text-center mt-10">Loading...</p>;

  // Filter visible testcases
  const visibleTCs = problem.testcases?.filter((tc) => !tc.hidden) || [];

  return (
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
                    <pre className="bg-[#1a1a1a] p-2 rounded">{tc.output}</pre>
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
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white font-semibold py-2 px-4 rounded-md shadow"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
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
          <button
            onClick={handleRun}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors text-white font-semibold py-2 px-4 rounded-md shadow"
          >
            {loading ? "Running..." : "Run on custom input"}
          </button>
        </div>

        {/* Output */}
        <div>
          <h3 className="text-white font-semibold mb-9">Output</h3>
          <pre className="w-full p-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-gray-200 whitespace-pre-wrap shadow-inner resize-y">
            {output}
          </pre>
        </div>
        {/* Verdicts */}
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
                    v === true
                      ? "bg-green-800 text-green-200"
                      : v === false
                      ? "bg-red-800 text-red-200"
                      : "bg-yellow-700 text-yellow-100"
                  }`}
                >
                  Testcase {idx + 1}:{" "}
                  {v === true ? "Passed ✅" : v === false ? "Failed ❌" : v}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetails;
