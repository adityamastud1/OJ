const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/compile", async (req, res) => {
  const { code, stdin = "", language = "cpp" } = req.body;

  const timestamp = Date.now();
  const folder = path.join(__dirname, "temp");
  const extensions = { cpp: "cpp", python: "py", java: "java" };
  const extension = extensions[language];

  const filename = `code_${timestamp}.${extension}`;
  const filepath = path.join(folder, filename);

  fs.writeFile(filepath, code, (err) => {
    if (err) return res.status(500).json({ error: "Failed to save file" });

    let compileCmd, runCmd;

    if (language === "cpp") {
      const outputExe = filepath.replace(`.${extension}`, ".exe");
      compileCmd = `g++ "${filepath}" -o "${outputExe}"`;
      runCmd = `"${outputExe}"`;
      exec(compileCmd, (compileErr, _, stderr) => {
        if (compileErr)
          return res.json({ output: `Compilation Error:\n${stderr}` });
        const runProcess = exec(runCmd, (runErr, stdout, stderrRun) => {
          if (runErr)
            return res.json({ output: `Runtime Error:\n${stderrRun}` });
          res.json({ output: stdout });
          fs.unlinkSync(filepath);
          fs.unlinkSync(outputExe);
        });
        runProcess.stdin.write(stdin);
        runProcess.stdin.end();
      });
    } else if (language === "python") {
      runCmd = `python "${filepath}"`;
      const runProcess = exec(runCmd, (runErr, stdout, stderr) => {
        if (runErr) return res.json({ output: `Runtime Error:\n${stderr}` });
        res.json({ output: stdout });
        fs.unlinkSync(filepath);
      });
      runProcess.stdin.write(stdin);
      runProcess.stdin.end();
    } else if (language === "java") {
      const tempDir = path.dirname(filepath); // ensure you mkdirSync(tempDir)
      // Overwrite filename to 'Main.java'
      const javaFile = path.join(tempDir, "Main.java");
      fs.writeFileSync(javaFile, code);

      // 1) Compile
      const compileJava = `javac "${javaFile}"`;
      exec(compileJava, (compileErr, _, stderr) => {
        if (compileErr) {
          return res.json({ output: `Compilation Error:\n${stderr}` });
        }

        // 2) Run
        const runJava = `java -cp "${tempDir}" Main`;
        const runProc = exec(runJava, (runErr, stdout, stderrRun) => {
          if (runErr) {
            return res.json({ output: `Runtime Error:\n${stderrRun}` });
          }
          res.json({ output: stdout });
          // Clean up
          fs.unlinkSync(javaFile);
          fs.unlinkSync(path.join(tempDir, "Main.class"));
        });

        runProc.stdin.write(stdin);
        runProc.stdin.end();
      });
    } else {
      res.status(400).json({ error: "Unsupported language" });
    }
  });
});

app.listen(8000, () => {
  console.log("✅ Compiler service running on port 8000");
});
