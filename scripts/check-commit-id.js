const fs = require("fs");

// Get the commit message file path from the argument
const commitMessageFile = process.argv[2];

if (!commitMessageFile) {
  console.error("Commit message file path is missing. Ensure the commit-msg hook passes the correct argument.");
  process.exit(1);
}

// Read the commit message
const commitMessage = fs.readFileSync(commitMessageFile, "utf8").trim();

// Regular expression to check the format
const validIdPattern = /^task-\d+/;

if (!validIdPattern.test(commitMessage)) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Invalid commit message. It must start with an ID in the format 'task-<number>'."
  );
  console.error("\x1b[33m%s\x1b[0m", `Your message: "${commitMessage}"`);
  process.exit(1);
}

console.log("\x1b[32m%s\x1b[0m", "Commit message format is valid.");
