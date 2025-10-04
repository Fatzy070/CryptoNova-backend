import express from "express";
import { addCoin, getPortfolio , deletePortfolio } from "../controller/PortfolioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/portfolio", authMiddleware, addCoin);
router.delete("/portfolio/:id", authMiddleware, deletePortfolio );


router.get("/portfolio", authMiddleware, getPortfolio);

export default router;
