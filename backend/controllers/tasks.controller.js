import { db } from "../db/database.js";
import crypto from "crypto";

export const getTasksByDesk = async (req, res) => {
    const { deskId } = req.params;

    const tasks = await db.all(
        `
    SELECT * FROM tasks
    WHERE deskId = ?
    ORDER BY datetime(createdAt) ASC
    `,
        [deskId]
    );

    res.json(tasks);
};


export const createTask = async (req, res) => {
    const { deskId, title } = req.body;
    if (!deskId || !title) {
        return res.status(400).json({ error: "deskId and title required" });
    }

    const task = {
        id: crypto.randomUUID(),
        deskId,
        title,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    await db.run(
        `INSERT INTO tasks VALUES (?, ?, ?, ?, ?)`,
        [task.id, task.deskId, task.title, task.status, task.createdAt]
    );

    res.status(201).json(task);
};

export const deleteTask = async (req, res) => {
    await db.run(
        `DELETE FROM tasks WHERE id = ?`,
        [req.params.taskId]
    );
    res.json({ message: "Task deleted" });
};

export const toggleTaskStatus = async (req, res) => {
    const task = await db.get(
        `SELECT * FROM tasks WHERE id = ?`,
        [req.params.taskId]
    );

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    const newStatus = task.status === "pending" ? "done" : "pending";

    await db.run(
        `UPDATE tasks SET status = ? WHERE id = ?`,
        [newStatus, task.id]
    );

    res.json({ ...task, status: newStatus });
};
