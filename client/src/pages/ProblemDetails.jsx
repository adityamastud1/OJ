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

  const handleRun = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COMPILER_URL}/compile`,
        {
          code,
          stdin,
          language
        }
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

  return (
    <div className="flex h-screen text-white" style={{ backgroundColor: "#20201E" }}>
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

      {/* Right side: Editor, Input, Output */}
      <div className="w-1/2 bg-[#434242] px-6 py-6 overflow-y-auto space-y-6">
        {/* Editor Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Code Editor</h2>
            <button
              onClick={handleRun}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors text-white font-semibold py-2 px-4 rounded-md shadow"
            >
              {loading ? "Running..." : "Run Code"}
            </button>
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
        </div>



        {/* Output */}
        <div>
          <h3 className="text-white font-semibold mb-9">Output</h3>
          <pre className="w-full p-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-gray-200 whitespace-pre-wrap shadow-inner  resize-y">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
