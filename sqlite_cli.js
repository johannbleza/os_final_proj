const Database = require("better-sqlite3");
const path = require("path");
const readline = require("readline");

const db = new Database(path.join(process.cwd(), "todos.db"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "sqlite3> ",
});

console.log("SQLite3 CLI - Type SQL commands or 'exit' to quit\n");

rl.prompt();

rl.on("line", (line) => {
  const input = line.trim();

  if (input.toLowerCase() === "exit" || input.toLowerCase() === ".exit") {
    console.log("Goodbye!");
    rl.close();
    process.exit(0);
  }

  if (!input) {
    rl.prompt();
    return;
  }

  try {
    // Check if it's a SELECT query
    if (input.toUpperCase().startsWith("SELECT")) {
      const stmt = db.prepare(input);
      const results = stmt.all();
      console.table(results);
    } else {
      // For INSERT, UPDATE, DELETE
      const stmt = db.prepare(input);
      const result = stmt.run();
      console.log(`Changes: ${result.changes}`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }

  rl.prompt();
});

rl.on("close", () => {
  db.close();
  process.exit(0);
});
