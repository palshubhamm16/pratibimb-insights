// routes/stateRoutes.js
import express from 'express';
import {
    getStateSummary,
    getTopDistricts,
    getCategoryDistribution,
    getTrendData,
    getTopDays,
    getTopSuspectNumbers,
    getScamReportByNumber,
    ackLookup,
    getVictimMappingSummary,
    getStateDailyFraudCounts
} from '../controllers/stateController.js';

const router = express.Router();

// Specific routes first
router.get("/scam-count", getScamReportByNumber);
router.get("/reports/ack/:ackNumber", ackLookup);

// Then state-specific routes (these have dynamic segments)
router.get("/:stateName/top-suspects", getTopSuspectNumbers);
router.get("/:stateName/summary", getStateSummary);
router.get("/:stateName/top-districts", getTopDistricts);
router.get("/:stateName/category-distribution", getCategoryDistribution);
router.get("/:stateName/trends", getTrendData);
router.get("/:stateName/top-days", getTopDays);
router.get("/:stateName/victim-mapping", getVictimMappingSummary);
router.get("/:state/trends/daily", getStateDailyFraudCounts);

export default router;
