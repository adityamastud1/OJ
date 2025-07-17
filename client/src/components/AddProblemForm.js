import React, { useState } from 'react';
import axios from 'axios';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const problemData = {
      ...form,
      testcases: JSON.parse(form.testcases) // expects JSON string for now
    };

    try {
      await axios.post('http://localhost:5000/problems', problemData, {
        withCredentials: true
      });
      alert('Problem created ✅');
      setForm({ ...form, title: '', description: '', testcases: '' });
    } catch (err) {
      console.error(err);
      alert('Failed ❌: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Add a New Problem (Admin Only)</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" /><br />
        <input name="inputFormat" value={form.inputFormat} onChange={handleChange} placeholder="Input Format" /><br />
        <input name="outputFormat" value={form.outputFormat} onChange={handleChange} placeholder="Output Format" /><br />
        <input name="constraints" value={form.constraints} onChange={handleChange} placeholder="Constraints" /><br />
        <input name="sampleInput" value={form.sampleInput} onChange={handleChange} placeholder="Sample Input" /><br />
        <input name="sampleOutput" value={form.sampleOutput} onChange={handleChange} placeholder="Sample Output" /><br />
        <select name="difficulty" value={form.difficulty} onChange={handleChange}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select><br />
        <textarea
          name="testcases"
          value={form.testcases}
          onChange={handleChange}
          placeholder='Testcases (JSON format: [{"input": "1 2", "output": "3"}])'
          required
        /><br />
        <button type="submit">Add Problem</button>
      </form>
    </div>
  );
};

export default AddProblemForm;
