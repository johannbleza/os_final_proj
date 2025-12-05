import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "todos.db"));

// Create the todos table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Todo {
  id: number;
  text: string;
  completed: number;
  created_at: string;
}

export function getAllTodos(): Todo[] {
  const stmt = db.prepare("SELECT * FROM todos ORDER BY created_at DESC");
  return stmt.all() as Todo[];
}

export function addTodo(text: string): Todo {
  const stmt = db.prepare("INSERT INTO todos (text) VALUES (?)");
  const result = stmt.run(text);
  return {
    id: result.lastInsertRowid as number,
    text,
    completed: 0,
    created_at: new Date().toISOString(),
  };
}

export function toggleTodo(id: number): void {
  const stmt = db.prepare(
    "UPDATE todos SET completed = NOT completed WHERE id = ?"
  );
  stmt.run(id);
}

export function deleteTodo(id: number): void {
  const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
  stmt.run(id);
}

export default db;
