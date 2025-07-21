import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, language }) => {
  return (
    <Editor
      height="400px"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
    />
  );
};

export default CodeEditor;
