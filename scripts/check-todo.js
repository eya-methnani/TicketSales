const { execSync } = require("child_process");

// Run git diff to find added/modified files
const diff = execSync("git diff --cached --name-only", {
  encoding: "utf-8",
});

const files = diff.split("\n").filter(Boolean);

let hasTodo = false;

files.forEach((file) => {
    // Skip node_modules, dist, and scripts directories
    if (
      file.includes("node_modules") ||
      file.includes("dist") ||
      file.includes("build") ||
      file.includes("scripts")
    ) {
      return;
    }
  
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      try {
        const content = execSync(`cat ${file}`, { encoding: "utf-8" });
        if (content.includes("TODO")) {
          console.error(`File contains TODO: ${file}`);
          hasTodo = true;
        }
      } catch (error) {
        console.error(`Error reading file: ${file}`, error.message);
      }
    }
  });

if (hasTodo) {
  console.error("Commit blocked: TODO found in code.");
  process.exit(1);
}
