import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
  filename: "./db/office.db",
  driver: sqlite3.Database
});

/* Create tables if they don't exist */
await db.exec(`
  CREATE TABLE IF NOT EXISTS desks (
    id TEXT PRIMARY KEY,
    owner TEXT,
    status TEXT,
    light INTEGER
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    deskId TEXT,
    title TEXT,
    status TEXT,
    createdAt TEXT
  );
`);

/* Seed desks if empty */
const deskCount = await db.get(`SELECT COUNT(*) as count FROM desks`);
if (deskCount.count === 0) {
  await db.run(`
    INSERT INTO desks (id, owner, status, light) VALUES
    ('desk-1', 'Bhavishya', 'online', 1),
    ('desk-2', 'Aryan', 'offline', 0)
  `);
}
