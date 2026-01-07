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

app.get("/api/desks", (_req, res) => {
  res.json(desks);
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
