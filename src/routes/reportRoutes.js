import { Router } from "express";
import { ReportController } from "../controllers/reportController.js";
import { validateUser } from "../middlewares/authMiddleware.js";

export const reportRouter = Router();

reportRouter.get("/", validateUser([true]), ReportController.getReport);


