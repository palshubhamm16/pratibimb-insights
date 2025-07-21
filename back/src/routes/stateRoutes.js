// routes/stateRoutes.js
import express from 'express';
import {
    getStateSummary,
    getTopDistricts,
    getCategoryDistribution,
    getTrendData,
    getTopDays,
} from '../controllers/stateController.js';

const router = express.Router();

router.get('/:stateName/summary', getStateSummary);
router.get('/:stateName/top-districts', getTopDistricts);
router.get('/:stateName/category-distribution', getCategoryDistribution);
router.get('/:stateName/trends', getTrendData);
router.get('/:stateName/top-days', getTopDays);

export default router;
