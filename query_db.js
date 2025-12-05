const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(process.cwd(), "todos.db"));

console.log("=== Todos Database ===\n");
const todos = db.prepare("SELECT * FROM todos").all();
console.log("All Todos:");
console.table(todos);

console.log("\n=== Available Commands ===");
console.log("To run queries, use:");
console.log("  db.prepare('SELECT * FROM todos').all()");
console.log("  db.prepare('INSERT INTO todos (text) VALUES (?)').run('Your todo')");
console.log("\nStarting interactive shell...\n");

// Start interactive shell
const repl = require("repl");
const context = repl.start("sqlite3> ").context;
context.db = db;
context.Database = Database;
