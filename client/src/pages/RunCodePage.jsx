import React, { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import axios from "axios";

const RunCodePage = () => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

    const handleRun = async () => {
    setLoading(true);
    try {
        const response = await axios.post(`${process.env.REACT_APP_COMPILER_URL}/compile`, {code, stdin});
        setOutput(response.data.output);
    } catch (err) {
        setOutput("Error: " + (err.response?.data?.error || "Something went wrong"));
    } finally {
        setLoading(false);
    }
    };


  return (
    <div >
      <div>
        <label>Select Language: </label>
        <div className="bg-[#000000] text-white p-2 rounded">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option className="bg-[#1c1c1c]" value="cpp">C++</option>
            <option className="bg-[#1c1c1c]" value="python">Python</option>
            <option className="bg-[#1c1c1c]" value="java">Java</option>
          </select>
        </div>
      </div>

      <CodeEditor code={code} setCode={setCode} language={language} />

      <div className="mt-10 border border-yellow-500 p-2">
        <textarea
          className="bg-[#1c1c1c] text-white w-full"
          placeholder="Enter input (stdin)"
          rows={5}
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
        />
      </div>


      <div className="mt-10 bg-[#f12222]">
        <button style = {{backgroundColor: "#f12222"}} className="mt-10 bg-[#f12222]" onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="mt-10 bg-[#1c1c1c]">
        <h3>Output:</h3>
        <pre className="bg-[#1c1c1c] ">{output}</pre>
      </div>
    </div>
  );
};

export default RunCodePage;
