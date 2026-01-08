import express from "express";
import {
  getTasksByDesk,
  createTask,
  deleteTask,
  toggleTaskStatus
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/:deskId", getTasksByDesk);
router.post("/", createTask);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId", toggleTaskStatus);

export default router;
