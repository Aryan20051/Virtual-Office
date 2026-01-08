import express from "express";
import { getDesks } from "../controllers/desks.controller.js";

const router = express.Router();

router.get("/", getDesks);

export default router;
