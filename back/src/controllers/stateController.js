// controllers/stateController.js
import FraudReport from '../models/FraudReport.js';

function getDateFilter(start, end) {
    if (!start || !end) return {};
    return {
        fetchedDate: {
            $gte: new Date(start),
            $lte: new Date(end),
        },
    };
}

export async function getStateSummary(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end } = req.query;
        const dateFilter = getDateFilter(start, end);

        const match = { state: stateName, ...dateFilter };

        const totalCases = await FraudReport.countDocuments(match);

        const totalAmountAgg = await FraudReport.aggregate([
            { $match: match },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);

        const topCarriersAgg = await FraudReport.aggregate([
            { $match: match },
            { $group: { _id: "$provider", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const totalAmount = totalAmountAgg[0]?.totalAmount || 0;
        const topCarriers = topCarriersAgg.map((item) => ({
            name: item._id || "Unknown",
            count: item.count,
        }));

        res.json({ totalCases, totalAmount, topCarriers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get summary" });
    }
}

export async function getTopDistricts(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end } = req.query;
        const dateFilter = getDateFilter(start, end);

        const match = { state: stateName, ...dateFilter };

        const result = await FraudReport.aggregate([
            { $match: match },
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const districtData = {};
        result.forEach((r) => {
            districtData[(r._id || "Unknown").toUpperCase()] = r.count;
        });
        res.json(districtData);
    } catch (err) {
        res.status(500).json({ error: "Failed to get top districts" });
    }
}

export async function getCategoryDistribution(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end } = req.query;
        const dateFilter = getDateFilter(start, end);

        const match = { state: stateName, ...dateFilter };

        const result = await FraudReport.aggregate([
            { $match: match },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        res.json(result.map((r) => ({ category: r._id || "Unknown", count: r.count })));
    } catch (err) {
        res.status(500).json({ error: "Failed to get category distribution" });
    }
}

import { startOfMonth, subMonths } from "date-fns";
export async function getTrendData(req, res) {
    try {
        const { stateName } = req.params;
        const { start: startQ, end: endQ } = req.query;

        // Default: Last 12 full months
        const defaultEnd = startOfMonth(new Date());
        const defaultStart = subMonths(defaultEnd, 12);

        const startDate = startQ ? new Date(startQ) : defaultStart;
        const endDate = endQ ? new Date(endQ) : defaultEnd;

        const match = {
            state: stateName,
            fetchedDate: { $gte: startDate, $lt: endDate },
        };

        // Total monthly trend
        const monthlyCases = await FraudReport.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$fetchedDate" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const totalTrendData = monthlyCases.map(d => ({
            month: d._id,
            count: d.count,
        }));

        // Category-wise monthly trend
        const categoryMonthly = await FraudReport.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: "%Y-%m", date: "$fetchedDate" } },
                        category: "$category",
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Step 1: Determine top 5 categories overall
        const topCategoriesAgg = await FraudReport.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const topCategories = topCategoriesAgg.map(c => c._id);

        // Step 2: Format category-wise monthly data
        const categoryTrendMap = {};
        categoryMonthly.forEach(({ _id, count }) => {
            const { month, category } = _id;
            if (!topCategories.includes(category)) return;

            if (!categoryTrendMap[month]) categoryTrendMap[month] = {};
            categoryTrendMap[month][category] = count;
        });

        // Step 3: Prepare structured array
        const allMonths = totalTrendData.map(d => d.month);
        const categoryTrendData = allMonths.map(month => {
            const entry = { month };
            topCategories.forEach(cat => {
                entry[cat] = categoryTrendMap[month]?.[cat] || 0;
            });
            return entry;
        });

        res.json({
            totalTrendData,
            categoryTrendData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get trend data" });
    }
}


export async function getTopDays(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end } = req.query;
        const dateFilter = getDateFilter(start, end);

        const match = { state: stateName, ...dateFilter };

        const result = await FraudReport.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$fetchedDate" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        res.json(result.map((d) => ({ date: d._id, count: d.count })));
    } catch (err) {
        res.status(500).json({ error: "Failed to get top fraud days" });
    }
}


// controller for fetching top suspect numbers
export const getTopSuspectNumbers = async (req, res) => {
    try {
        const { state } = req.params;
        const { start, end } = req.query;

        const matchStage = {
            state,
            suspectNumber: { $ne: null },
        };

        // Apply date filter if both start and end are provided
        if (start && end) {
            matchStage.fetchedDate = {
                $gte: new Date(start),
                $lte: new Date(end),
            };
        }

        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: "$suspectNumber",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    number: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ];

        const topSuspects = await FraudReport.aggregate(pipeline);
        res.json(topSuspects);
    } catch (err) {
        console.error("Error fetching top suspect numbers:", err);
        res.status(500).json({ error: "Failed to fetch top suspects" });
    }
};
