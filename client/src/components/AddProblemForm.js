import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Select from "react-select";
import { TAG_OPTIONS } from "../constants/tagOptions";

const AddProblemForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    score: 0,
    difficulty: "Easy",
    tags: [],
    testcases: [],
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagChange = (selected) => {
    setSelectedTags(selected);
    setForm({ ...form, tags: selected.map((t) => t.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/problems`, form, {
        withCredentials: true,
      });
      alert("✅ Problem created");
      setForm({
        title: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        constraints: "",
        score: 0,
        difficulty: "Easy",
        tags: [],
        testcases: [],
      });
      setSelectedTags([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleTestcaseChange = (idx, field, value) => {
    const updated = [...form.testcases];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, testcases: updated });
  };

  const addTestcase = () => {
    setForm({
      ...form,
      testcases: [
        ...form.testcases,
        {
          input: "",
          output: "",
          isSample: false,
          hidden: true,
          score: 0,
          timeLimit: 1000,
          memoryLimit: 256,
        },
      ],
    });
  };

  const removeTestcase = (idx) => {
    setForm({
      ...form,
      testcases: form.testcases.filter((_, i) => i !== idx),
    });
  };

  return (
    <div
      className="max-w-4xl mx-auto mt-10 text-white p-6 rounded shadow-lg"
      style={{ backgroundColor: "#171716" }}
    >
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        📌 Add a New Problem (Admin Only)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500"
        />

        {["description", "inputFormat", "outputFormat", "constraints"].map(
          (field) => (
            <textarea
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={`${
                field.charAt(0).toUpperCase() + field.slice(1)
              } (Markdown supported)`}
              rows={5}
              className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500"
            />
          )
        )}

        <label className="flex items-center gap-2">
          Score
          <input
            type="number"
            name="score"
            value={form.score}
            onChange={handleChange}
            className="w-16 p-1 bg-[#0f0f0f] border border-gray-600 rounded"
          />
        </label>
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded text-white focus:outline-none"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Testcases
          </label>
          {form.testcases.map((tc, idx) => (
            <div
              key={idx}
              className="border border-gray-600 p-3 rounded bg-[#0f0f0f]"
            >
              <label className="block text-sm text-gray-400 mb-1">Input</label>
              <textarea
                rows={3}
                name="input"
                value={tc.input}
                onChange={(e) =>
                  handleTestcaseChange(idx, "input", e.target.value)
                }
                className="w-full mb-2 p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none"
              />

              <label className="block text-sm text-gray-400 mb-1">Output</label>
              <textarea
                rows={3}
                name="output"
                value={tc.output}
                onChange={(e) =>
                  handleTestcaseChange(idx, "output", e.target.value)
                }
                className="w-full mb-2 p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none"
              />

              <div className="flex flex-wrap gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="hidden"
                    checked={tc.hidden}
                    onChange={(e) =>
                      handleTestcaseChange(idx, "hidden", e.target.checked)
                    }
                  />{" "}
                  Hidden
                </label>

                <label className="flex items-center gap-2">
                  Time Limit (ms)
                  <input
                    type="number"
                    name="timeLimit"
                    value={tc.timeLimit}
                    onChange={(e) =>
                      handleTestcaseChange(
                        idx,
                        "timeLimit",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-20 p-1 bg-[#0f0f0f] border border-gray-600 rounded"
                  />
                </label>
                <label className="flex items-center gap-2">
                  Memory Limit (MB)
                  <input
                    type="number"
                    name="memoryLimit"
                    value={tc.memoryLimit}
                    onChange={(e) =>
                      handleTestcaseChange(
                        idx,
                        "memoryLimit",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-20 p-1 bg-[#0f0f0f] border border-gray-600 rounded"
                  />
                </label>
              </div>

              <button
                type="button"
                className="mt-2 text-sm text-red-400 hover:text-red-500"
                onClick={() => removeTestcase(idx)}
              >
                ❌ Remove Testcase
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-indigo-400 hover:text-indigo-500"
            onClick={addTestcase}
          >
            ➕ Add Testcase
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Tags (max 5)
          </label>
          <Select
            isMulti
            options={TAG_OPTIONS}
            value={selectedTags}
            onChange={handleTagChange}
            closeMenuOnSelect={false}
            className="text-black"
            placeholder="Select tags..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#0f0f0f",
                borderColor: "#4b5563",
              }),
              menu: (base) => ({ ...base, backgroundColor: "#1f1f23" }),
            }}
            maxMenuHeight={150}
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded font-semibold transition"
        >
          ➕ Add Problem
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-2 border-b border-gray-700 pb-1">
          📄 Live Preview
        </h3>
        {[
          ["Description", form.description],
          ["Input Format", form.inputFormat],
          ["Output Format", form.outputFormat],
          ["Constraints", form.constraints],
        ].map(([label, content]) => (
          <div className="mb-4" key={label}>
            <h4 className="text-lg font-semibold mb-1">{label}</h4>
            <div className="bg-[#0f0f0f] border border-gray-700 p-3 rounded text-sm whitespace-pre-wrap">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProblemForm;
