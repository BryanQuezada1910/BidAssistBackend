import { Router } from "express";
import { ReportController } from "../controllers/reportController.js";

export const reportRouter = Router();

reportRouter.get("/", ReportController.getReport);


