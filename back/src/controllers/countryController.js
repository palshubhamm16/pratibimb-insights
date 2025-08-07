import FraudReport from "../models/FraudReport.js";
import dayjs from "dayjs";
import { startOfMonth, subMonths } from "date-fns";

export async function getNationalSummary(req, res) {
    try {
        const now = dayjs();
        const startOfMonth = now.startOf("month").toDate();
        const endOfMonth = now.endOf("month").toDate();

        const allReports = await FraudReport.find({});
        const thisMonthReports = await FraudReport.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const totalReports = allReports.length;
        const totalAmount = allReports.reduce((sum, r) => sum + (r.amount || 0), 0);
        const thisMonthCount = thisMonthReports.length;

        res.json({
            totalReports,
            totalAmount,
            thisMonthReports: thisMonthCount,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to get summary data" });
    }
}

export async function getTopStates(req, res) {
    try {
        const result = await FraudReport.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        const formatted = result.map((r) => ({
            district: r._id || "Unknown",
            count: r.count,
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: "Failed to get top states" });
    }
}

export async function getIndiaHeatmapData(req, res) {
    try {
        const result = await FraudReport.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } },
        ]);

        const heatmapData = {};
        result.forEach((r) => {
            heatmapData[r._id || "Unknown"] = r.count;
        });

        res.json(heatmapData);
    } catch (err) {
        res.status(500).json({ error: "Failed to get heatmap data" });
    }
}



// TREND DATA for national dashboard (same shape as state trends)
export async function getNationalTrends(req, res) {
    try {
        const defaultEnd = startOfMonth(new Date());
        const defaultStart = subMonths(defaultEnd, 12);

        const match = {
            fetchedDate: { $gte: defaultStart, $lt: defaultEnd },
        };

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

        const topCategoriesAgg = await FraudReport.aggregate([
            { $match: match },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const topCategories = topCategoriesAgg.map(c => c._id);

        const categoryTrendMap = {};
        categoryMonthly.forEach(({ _id, count }) => {
            const { month, category } = _id;
            if (!topCategories.includes(category)) return;

            if (!categoryTrendMap[month]) categoryTrendMap[month] = {};
            categoryTrendMap[month][category] = count;
        });

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
        res.status(500).json({ error: "Failed to get national trend data" });
    }
}

// PIE CHART for national category breakdown
export async function getNationalCategoryBreakdown(req, res) {
    try {
        const result = await FraudReport.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const formatted = result.map(({ _id, count }) => ({
            category: _id || "Unknown",
            count,
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get national category breakdown" });
    }
}
