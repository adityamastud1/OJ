const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { spawn, exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

app.post("/compile", (req, res) => {
  const { code, language = "cpp" } = req.body;
  // use same fallback key in all languages:
  const rawInput = req.body.stdin ?? req.body.input ?? "";

  const timestamp = Date.now();
  const extensions = { cpp: "cpp", python: "py", java: "java" };
  const ext = extensions[language];
  const filename = `code_${timestamp}.${ext}`;
  const filepath = path.join(TEMP_DIR, filename);

  // Save incoming source
  fs.writeFileSync(filepath, code);

  // cleanup helper
  const cleanup = (files) => {
    files.forEach((f) => {
      try { fs.unlinkSync(f); } catch (_) {}
    });
  };

  if (language === "cpp") {
    // -- (unchanged) --
    const exe = filepath.replace(".cpp", ".exe");
    exec(`g++ "${filepath}" -o "${exe}"`, (err, _, stderr) => {
      if (err) return res.json({ output: "Compilation Error:\n" + stderr });
      const p = spawn(exe, []);
      p.stdin.write(rawInput);
      p.stdin.end();

      let out = "", errOut = "";
      p.stdout.on("data", d => out += d);
      p.stderr.on("data", d => errOut += d);
      p.on("close", code => {
        cleanup([filepath, exe]);
        if (code !== 0) return res.json({ output: "Runtime Error:\n" + errOut });
        res.json({ output: out });
      });
    });

  } else if (language === "python") {
    // write rawInput directly
    const p = spawn("python", [filepath]);
    p.stdin.write(rawInput);
    p.stdin.end();

    let out = "", errOut = "";
    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => errOut += d);
    p.on("close", code => {
      cleanup([filepath]);
      if (code !== 0) return res.json({ output: "Runtime Error:\n" + errOut });
      res.json({ output: out });
    });

  } else if (language === "java") {
    // rewrite class name for uniqueness
    const className = `Main_${timestamp}`;
    const javaFile = path.join(TEMP_DIR, `${className}.java`);
    const modifiedCode = code.replace(
      /public\s+class\s+\w+/,
      `public class ${className}`
    );
    fs.writeFileSync(javaFile, modifiedCode);

    exec(`javac "${javaFile}"`, (err, _, stderr) => {
      if (err) {
        cleanup([filepath, javaFile]);
        return res.json({ output: "Compilation Error:\n" + stderr });
      }
      const p = spawn("java", ["-cp", TEMP_DIR, className]);
      p.stdin.write(rawInput);
      p.stdin.end();

      let out = "", errOut = "";
      p.stdout.on("data", d => out += d);
      p.stderr.on("data", d => errOut += d);
      p.on("close", code => {
        cleanup([
          filepath,
          javaFile,
          path.join(TEMP_DIR, `${className}.class`)
        ]);
        if (code !== 0) return res.json({ output: "Runtime Error:\n" + errOut });
        res.json({ output: out });
      });
    });

  } else {
    res.status(400).json({ error: "Unsupported language" });
  }
});

app.listen(8000, () => {
  console.log("✅ Compiler service running on port 8000");
});
