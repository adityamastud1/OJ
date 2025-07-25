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

const TIME_LIMIT_MS = 3000;

app.post("/compile", (req, res) => {
  const { code, language = "cpp" } = req.body;
  const rawInput = req.body.stdin ?? req.body.input ?? "";

  const timestamp = Date.now();
  const extensions = { cpp: "cpp", python: "py", java: "java" };
  const ext = extensions[language];
  const filename = `code_${timestamp}.${ext}`;
  const filepath = path.join(TEMP_DIR, filename);

  fs.writeFileSync(filepath, code);

  const cleanup = (files) => {
    files.forEach((f) => {
      try { fs.unlinkSync(f); } catch (_) {}
    });
  };

  if (language === "cpp") {
    const exe = filepath.replace(".cpp", ".exe");
    exec(`g++ "${filepath}" -o "${exe}"`, (err, _, stderr) => {
      if (err) {
        console.error("Compilation error:", stderr);
        cleanup([filepath]);
        return res.json({ output: "Compilation Error:\n" + stderr });
      }

      const p = spawn(exe, []);
      const timeout = setTimeout(() => p.kill("SIGKILL"), TIME_LIMIT_MS);

      let out = "", errOut = "";
      p.stdin.write(rawInput);
      p.stdin.end();

      p.stdout.on("data", d => out += d);
      p.stderr.on("data", d => errOut += d);

      p.on("close", code => {
        clearTimeout(timeout);
        cleanup([filepath, exe]);

        if (code === null) return res.json({ output: "Time Limit Exceeded" });
        if (code !== 0) return res.json({ output: "Runtime Error:\n" + errOut });

        res.json({ output: out });
      });
    });

  } else if (language === "python") {
    const p = spawn("python", [filepath]);
    const timeout = setTimeout(() => p.kill("SIGKILL"), TIME_LIMIT_MS);

    let out = "", errOut = "";
    p.stdin.write(rawInput);
    p.stdin.end();

    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => errOut += d);

    p.on("close", code => {
      clearTimeout(timeout);
      cleanup([filepath]);

      if (code === null) return res.json({ output: "Time Limit Exceeded" });
      if (code !== 0) return res.json({ output: "Runtime Error:\n" + errOut });

      res.json({ output: out });
    });

  } else if (language === "java") {
    const className = `Main_${timestamp}`;
    const javaFile = path.join(TEMP_DIR, `${className}.java`);
    const modifiedCode = code.replace(
      /public\s+class\s+\w+/,
      `public class ${className}`
    );
    fs.writeFileSync(javaFile, modifiedCode);

    exec(`javac "${javaFile}"`, (err, _, stderr) => {
      if (err) {
        console.error("Compilation error:", stderr);
        cleanup([filepath, javaFile]);
        return res.json({ output: "Compilation Error:\n" + stderr });
      }

      const p = spawn("java", ["-cp", TEMP_DIR, className]);
      const timeout = setTimeout(() => p.kill("SIGKILL"), TIME_LIMIT_MS);

      let out = "", errOut = "";
      p.stdin.write(rawInput);
      p.stdin.end();

      p.stdout.on("data", d => out += d);
      p.stderr.on("data", d => errOut += d);

      p.on("close", code => {
        clearTimeout(timeout);
        cleanup([filepath, javaFile, path.join(TEMP_DIR, `${className}.class`)]);

        if (code === null) return res.json({ output: "Time Limit Exceeded" });
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
