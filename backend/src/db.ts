import Database from "better-sqlite3";

export const db = new Database("office.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS desks (
  id TEXT PRIMARY KEY,
  ownerId TEXT,
  light INTEGER DEFAULT 0
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  deskId TEXT,
  title TEXT,
  status TEXT
)`).run();
