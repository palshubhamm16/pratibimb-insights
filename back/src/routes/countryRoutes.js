import express from "express";
import {
    getNationalSummary,
    getIndiaHeatmapData,
    getTopStates,
    getNationalTrends,
    getNationalCategoryBreakdown,
} from "../controllers/countryController.js";

const router = express.Router();

router.get("/summary", getNationalSummary);
router.get("/heatmap", getIndiaHeatmapData);
router.get("/top-states", getTopStates);
router.get("/trends", getNationalTrends); // ✅ new
router.get("/category-breakdown", getNationalCategoryBreakdown); // ✅ new

export default router;
