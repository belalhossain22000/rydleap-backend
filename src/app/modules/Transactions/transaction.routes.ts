import express from "express";
import auth from "../../middlewares/auth";
import { transactionController } from "./transaction.controller";

const router = express.Router();

router.get("/", auth("ADMIN"), transactionController.getUserTransactions);

export const transactionRoutes = router;
