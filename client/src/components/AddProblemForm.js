import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Select from 'react-select';
import { TAG_OPTIONS } from '../constants/tagOptions';

const AddProblemForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    difficulty: 'Easy',
    testcases: ''
  });

  // New state for tags
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build the payload
      const payload = {
        ...form,
        testcases: JSON.parse(form.testcases),
        tags: selectedTags.map(t => t.value)  // send array of strings
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/problems`,
        payload,
        { withCredentials: true }
      );

      alert('✅ Problem created');

      // Reset form and tags
      setForm({
        title: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        sampleInput: '',
        sampleOutput: '',
        difficulty: 'Easy',
        testcases: ''
      });
      setSelectedTags([]);
    } catch (err) {
      console.error(err);
      alert('❌ Failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10  text-white p-6 rounded shadow-lg" style={{backgroundColor: '#171716'}}>
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        📌 Add a New Problem (Admin Only)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500"
        />

        {/* Description, Input, Output, Constraints */}
        {['description', 'inputFormat', 'outputFormat', 'constraints'].map(field => (
          <textarea
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} (Markdown supported)`}
            rows={5}
            className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        ))}

        {/* Sample Input/Output */}
        <div className="grid grid-cols-2 gap-4">
          <textarea
            name="sampleInput"
            value={form.sampleInput}
            onChange={handleChange}
            placeholder="Sample Input"
            rows={4}
            className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <textarea
            name="sampleOutput"
            value={form.sampleOutput}
            onChange={handleChange}
            placeholder="Sample Output"
            rows={4}
            className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* Difficulty */}
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

        {/* Testcases */}
        <textarea
          name="testcases"
          value={form.testcases}
          onChange={handleChange}
          placeholder='Testcases (JSON format: [{"input": "1 2", "output": "3"}])'
          rows={5}
          required
          className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500"
        />

        {/* Tags Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Tags (max 5)
          </label>
          <Select
            isMulti
            options={TAG_OPTIONS}
            value={selectedTags}
            onChange={setSelectedTags}
            closeMenuOnSelect={false}
            className="text-black"
            placeholder="Select tags..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#0f0f0f',
                borderColor: '#4b5563'
              }),
              menu: (base) => ({ ...base, backgroundColor: '#1f1f23' }),
            }}
            maxMenuHeight={150}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded font-semibold transition"
        >
          ➕ Add Problem
        </button>
      </form>

      {/* Live Preview */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-2 border-b border-gray-700 pb-1">
          📄 Live Preview
        </h3>
        {[
          ['Description', form.description],
          ['Input Format', form.inputFormat],
          ['Output Format', form.outputFormat],
          ['Constraints', form.constraints],
          ['Sample Input', '```\n' + form.sampleInput + '\n```'],
          ['Sample Output', '```\n' + form.sampleOutput + '\n```']
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
