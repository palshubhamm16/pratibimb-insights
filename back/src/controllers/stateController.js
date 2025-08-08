// controllers/stateController.js
import FraudReport from '../models/FraudReport.js';
import { startOfMonth, subMonths } from "date-fns";
import dayjs from "dayjs";



// Utility to handle date and category filters
function getDateFilter(start, end) {
    if (!start || !end) return {};
    return {
        fetchedDate: {
            $gte: new Date(start),
            $lte: new Date(end),
        },
    };
}

function getCategoryFilter(categories) {
    if (!categories || categories.length === 0) return {};
    return {
        category: { $in: Array.isArray(categories) ? categories : [categories] },
    };
}

// SUMMARY
export async function getStateSummary(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end, categories } = req.query;
        const match = {
            state: stateName,
            ...getDateFilter(start, end),
            ...getCategoryFilter(categories),
        };

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

// TOP DISTRICTS
export async function getTopDistricts(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end, categories } = req.query;
        const match = {
            state: stateName,
            ...getDateFilter(start, end),
            ...getCategoryFilter(categories),
        };

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

// CATEGORY DISTRIBUTION
export async function getCategoryDistribution(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end, categories } = req.query;
        const match = {
            state: stateName,
            ...getDateFilter(start, end),
            ...getCategoryFilter(categories),
        };

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

// TREND DATA
export async function getTrendData(req, res) {
    try {
        const { stateName } = req.params;
        const { start: startQ, end: endQ, categories } = req.query;

        const defaultEnd = startOfMonth(new Date());
        const defaultStart = subMonths(defaultEnd, 12);

        const startDate = startQ ? new Date(startQ) : defaultStart;
        const endDate = endQ ? new Date(endQ) : defaultEnd;

        const match = {
            state: stateName,
            fetchedDate: { $gte: startDate, $lt: endDate },
            ...getCategoryFilter(categories),
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
        res.status(500).json({ error: "Failed to get trend data" });
    }
}

// TOP DAYS
export async function getTopDays(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end, categories } = req.query;
        const match = {
            state: stateName,
            ...getDateFilter(start, end),
            ...getCategoryFilter(categories),
        };

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

// TOP SUSPECT NUMBERS
export const getTopSuspectNumbers = async (req, res) => {
    try {
        const { stateName } = req.params;
        const { start, end, categories } = req.query;

        const matchStage = {
            state: stateName,
            suspectNumber: { $ne: null },
            ...getDateFilter(start, end),
            ...getCategoryFilter(categories),
        };

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

// SCAMMER CHECK
export const getScamReportByNumber = async (req, res) => {
    const number = req.query.number;

    if (!number) {
        return res.status(400).json({ message: "Missing number query param" });
    }

    try {
        const reports = await FraudReport.find({ suspectNumber: number });

        const count = reports.length;

        const locations = reports.map((report) => ({
            state: report.state,
            district: report.district,
            address: report.address,
            lat: report.location?.coordinates?.[1],
            lng: report.location?.coordinates?.[0],
        }));

        res.json({ count, locations });
    } catch (err) {
        console.error("Error in getScamCountByNumber:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ACK LOOKUP
export const ackLookup = async (req, res) => {
    const { ackNumber } = req.params;
    const report = await FraudReport.findOne({ "victim.ackNumber": ackNumber });

    if (!report) {
        return res.status(404).json({ message: "No report found." });
    }

    res.json(report);
}

// VICTIM MAPPING
export async function getVictimMappingSummary(req, res) {
    try {
        const { stateName } = req.params;
        const { start, end, categories } = req.query;

        const matchStage = {
            state: stateName,
            "victim.state": { $ne: null },
            ...getDateFilter(start, end),
            ...getCategoryFilter(categories),
        };

        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: "$victim.state",
                    victimCount: { $sum: 1 },
                    fraudAmount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    victimCount: 1,
                    fraudAmount: 1
                }
            },
            { $sort: { victimCount: -1 } }
        ];

        const result = await FraudReport.aggregate(pipeline);
        res.json(result);
    } catch (err) {
        console.error("Error in victim-mapping:", err);
        res.status(500).json({ error: "Failed to get victim mapping summary" });
    }
}

// DAILY FRAUD COUNTS

export const getStateDailyFraudCounts = async (req, res) => {
    try {
        const { state } = req.params;
        const { days = 90, category, startDate, endDate } = req.query;

        // Determine date range
        const start = startDate
            ? dayjs(startDate).startOf("day").toDate()
            : dayjs().subtract(days - 1, "day").startOf("day").toDate();

        const end = endDate
            ? dayjs(endDate).endOf("day").toDate()
            : dayjs().endOf("day").toDate();

        // Match conditions
        const match = {
            state: state,
            fetchedDate: { $gte: start, $lte: end },
        };

        if (category) {
            match.category = category;
        }

        // Aggregate counts per date
        const results = await FraudReport.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$fetchedDate",
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill missing dates with 0 counts
        const filledResults = [];
        for (let i = 0; i < days; i++) {
            const date = dayjs(start).add(i, "day").format("YYYY-MM-DD");
            const found = results.find(
                (r) => dayjs(r._id).format("YYYY-MM-DD") === date
            );
            filledResults.push({
                date,
                count: found ? found.count : 0,
            });
        }

        res.json(filledResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch state daily fraud counts" });
    }
};
