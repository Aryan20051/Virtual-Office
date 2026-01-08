import express from "express";
import cors from "cors";

import desksRoutes from "./routes/desks.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/* Routes */
app.use("/api/desks", desksRoutes);
app.use("/api/tasks", tasksRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
