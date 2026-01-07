import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const desks = [
  { id: "desk-1", owner: "Bhavishya", status: "online", light: true },
  { id: "desk-2", owner: "Aryan", status: "offline", light: false }
];

const tasks = [
  {
    id: "task-1",
    deskId: "desk-1",
    title: "Fix UI bug",
    status: "pending"
  },
  {
    id: "task-2",
    deskId: "desk-1",
    title: "Add login screen",
    status: "pending"
  },
  {
    id: "task-3",
    deskId: "desk-2",
    title: "Setup backend APIs",
    status: "done"
  }
];


app.get("/api/desks", (_req, res) => {
  res.json(desks);
});

app.get("/api/tasks/:deskId", (req, res) => {
  const deskId = req.params.deskId;
  const deskTasks = tasks.filter(task => task.deskId === deskId);
  res.json(deskTasks);
});

app.post("/api/tasks", (req, res) => {
  const { deskId, title } = req.body;

  if (!deskId || !title) {
    return res.status(400).json({
      error: "deskId and title are required"
    });
  }

  const newTask = {
    id: `task-${tasks.length + 1}`,
    deskId,
    title,
    status: "pending"
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});


app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
