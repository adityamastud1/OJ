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

  const handleRun = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/compile`, {
        code,
      });
      setOutput(response.data.output);
    } catch (err) {
      setOutput(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/problems/${id}`, { withCredentials: true })
      .then((res) => setProblem(res.data))
      .catch((err) => console.error("Error fetching problem:", err));
  }, [id]);

  if (!problem)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="flex h-screen bg-[#1c1c1c] text-white">
      {/* Left side: Problem description */}
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
          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <div>
              <ReactMarkdown>{problem.description}</ReactMarkdown>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Input Format</h2>
            <div>
              <ReactMarkdown>{problem.inputFormat}</ReactMarkdown>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Output Format</h2>
            <div>
              <ReactMarkdown>{problem.outputFormat}</ReactMarkdown>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Constraints</h2>
            <div>
              <ReactMarkdown>{problem.constraints}</ReactMarkdown>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Sample Input</h2>
            <pre className="bg-[#0f0f0f] p-3 rounded">
              {problem.sampleInput}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Sample Output</h2>
            <pre className="bg-[#0f0f0f] p-3 rounded">
              {problem.sampleOutput}
            </pre>
          </div>
        </div>
      </div>

      {/* Right side: Editor placeholder */}
      <div className="w-1/2 bg-[#1c1c1c] px-6 py-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2 text-white">Code</h2>
        <div className="h-[90%] border border-gray-700 rounded bg-[#0f0f0f] p-4 text-gray-300">
          {/* Replace this with actual Monaco or Ace editor later */}
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <CodeEditor code={code} setCode={setCode} language="cpp" />
            </div>

            <button
              className="mt-4 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded"
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? "Running..." : "Run Code"}
            </button>

            <div className="mt-4">
              <h3 className="text-white font-semibold mb-1">Output:</h3>
              <pre className="bg-[#0f0f0f] p-3 rounded text-gray-300 whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
