// src/services/summary.service.js
import prisma from "../db/prisma.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import minMax from "dayjs/plugin/minMax.js";
import pkg from "@prisma/client";

dayjs.extend(isBetween);
dayjs.extend(minMax);

const { Decimal } = pkg;

const getInvestment = async (tx, { sm, sy }) => {
    const startDate = new Date(sy, sm - 1, 1);
    const endDate = new Date(sy, sm, 0);
    return await tx.investment.findFirst({
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
    });
};

export const generateSummary = async (tx, { month, year }) => {
    const sDate = new Date(year, month - 1, 1);
    const eDate = new Date(year, month, 0);

    const manualTransactions = await tx.manualTransaction.findMany({
        where: {
            date: {
                gte: sDate,
                lt: eDate,
            },
        },
    });

    const sumByType = (type) =>
        manualTransactions
            .filter((m) => m.type === type)
            .reduce((a, b) => a + (Number(b.amount) || 0), 0);

    const totalExpense = sumByType("EXPENSE");
    const totalDebtIncurred = sumByType("DEBT");
    const totalCash = sumByType("CASH");
    const totalBank = sumByType("BANK");

    const sales = await tx.sale.findMany({
        where: {
            saleDate: {
                gte: sDate,
                lt: eDate,
            },
        },
        include: {
            product: true,
            customer: true,
        },
    });

    const totalSalesRevenue = sales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
    const costOfStock = sales.reduce(
        (sum, s) => sum + (Number(s.buyingPrice) * Number(s.quantity) || 0),
        0
    );
    const grossProfit = totalSalesRevenue - costOfStock;
    const netProfit = grossProfit - totalExpense;

    const totalDebtOnCustomers = sales.reduce(
        (sum, s) => sum + (Number(s.remainingAmount) || 0),
        0
    );

    const products = await tx.product.findMany({
        where: {
            stockTransaction: {
                some: {
                    date: {
                        gte: sDate,
                        lt: eDate,
                    },
                },
            },
        },
        include: {
            stockTransaction: {
                select: {
                    id: true,
                    date: true,
                    quantity: true,
                },
                orderBy: {
                    date: "desc",
                },
            },
        },
    });

    const currentStockValue = products.reduce(
        (sum, p) => sum + (Number(p.stockQuantity) * Number(p.sellingPrice) || 0),
        0
    );
    const totalStockQuantity = products.reduce(
        (sum, p) => sum + (Number(p.stockQuantity) || 0),
        0
    );

    const totalCustomers = await tx.customer.count();
    const totalProducts = products.length;
    const investmentRecord = await getInvestment(tx, { sm: month, sy: year });
    const totalInvestment = investmentRecord?.investment || 0;

    const totalAssetsValue = currentStockValue + totalSalesRevenue;

    const metrics = {
        month,
        year,
        totalExpense,
        totalDebt: totalDebtIncurred,
        totalBank,
        totalCash,
        totalInvestment,
        totalAssetsValue,
        totalSales: totalSalesRevenue,
        costOfStock,
        grossProfit,
        netProfit,
        stockValue: currentStockValue,
        totalDebtOnCustomers,
        totalCustomers,
        totalProducts,
        totalStockQuantity,
    };

    return await tx.monthlySummary.upsert({
        where: {
            year_month: {
                month,
                year,
            },
        },
        update: metrics,
        create: metrics,
    });
};

function getMonthRange(sm, sy, em, ey) {
    const result = [];
    let start = sy * 12 + (sm - 1);
    let end = ey * 12 + (em - 1);

    if (start > end) [start, end] = [end, start];

    for (let i = start; i <= end; i++) {
        const year = Math.floor(i / 12);
        const month = (i % 12) + 1;
        result.push({ month, year });
    }

    return result;
}

function normalizeRange(sm, sy, em, ey) {
    const currentYear = new Date().getFullYear();

    sy = sy || currentYear;
    ey = ey || sy;

    if (sm && sy && !em && !ey) {
        return {
            from: { month: sm, year: sy },
            to: { month: sm, year: sy },
        };
    }

    if (em && ey && !sm && !sy) {
        return {
            from: { month: em, year: ey },
            to: { month: em, year: ey },
        };
    }

    if (!sm) sm = new Date().getMonth() + 1;
    if (!em) em = sm;
    if (!sy) sy = currentYear;
    if (!ey) ey = sy;

    let startIndex = sy * 12 + (sm - 1);
    let endIndex = ey * 12 + (em - 1);

    if (startIndex > endIndex) [sm, sy, em, ey] = [em, ey, sm, sy];

    return {
        from: {
            month: sm,
            year: sy === ey ? "" : sy,
        },
        to: {
            month: em,
            year: ey,
        },
    };
}

export const getSummary = async (data) => {
    const { sMonth: sm, sYear: sy, eMonth: em, eYear: ey } = data;

    return await prisma.$transaction(async (tx) => {
        const dateRange = [];
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        if (sm && sy && em && ey) {
            getMonthRange(sm, sy, em, ey).forEach((r) => dateRange.push(r));
        } else if (!sm && !sy && !em && !ey) {
            dateRange.push({ month: currentMonth, year: currentYear });
        } else if (sm && sy && !em && !ey) {
            dateRange.push({ month: sm, year: sy });
        } else if (sm && !sy && !em && !ey) {
            dateRange.push({ month: sm, year: currentYear });
        } else if (!sm && sy && !em && !ey) {
            for (let i = 1; i <= 12; i++) dateRange.push({ month: i, year: sy });
        } else if (!sm && !sy && em && !ey) {
            dateRange.push({ month: em, year: currentYear });
        } else if (!sm && !sy && !em && ey) {
            for (let i = 1; i <= 12; i++) dateRange.push({ month: i, year: ey });
        } else if (sm && !sy && em && !ey) {
            getMonthRange(sm, currentYear, em, currentYear).forEach((r) => dateRange.push(r));
        } else if (!sm && sy && em && !ey) {
            getMonthRange(1, sy, em, sy).forEach((r) => dateRange.push(r));
        } else if (sm && sy && !em && ey) {
            getMonthRange(sm, sy, 12, ey).forEach((r) => dateRange.push(r));
        }

        const summaries = [];

        for (const { month, year } of dateRange) {
            const summary = await tx.monthlySummary.findUnique({
                where: { year_month: { month, year } },
            });

            if (summary) {
                const {
                    id,
                    month,
                    year,
                    createdAt,
                    totalCustomers,
                    totalProducts,
                    ...rest
                } = summary;
                summaries.push(rest);
            }
        }

        const summary = summaries.reduce((acc, obj) => {
            for (const key in obj) {
                acc[key] = (acc[key] || 0) + (Number(obj[key]) || 0);
            }
            return acc;
        }, {});

        const latestSummary = summaries[summaries.length - 1];

        if (latestSummary) {
            summary.stockValue = latestSummary.stockValue;
            summary.totalStockQuantity = latestSummary.totalStockQuantity;
            summary.totalDebtOnCustomers = latestSummary.totalDebtOnCustomers;
            summary.totalAssetsValue = latestSummary.totalAssetsValue;
        }

        const totalProducts = await tx.product.count();
        const totalCustomers = await tx.customer.count();

        summary.totalProducts = totalProducts;
        summary.totalCustomers = totalCustomers;

        const range = normalizeRange(sm, sy, em, ey);

        if ((sy && sm && (!ey || !em)) || (sy === ey && sm === em)) {
            summary.from = { month: sm, year: sy };
        } else {
            summary.from = range.from;
            summary.to = range.to;
        }

        return summary;
    });
};

export const getSummaries = async (where, { page, limit }) => {
    return await prisma.$transaction(async (tx) => {
        const monthlySummaries = await tx.monthlySummary.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
        });

        const total = await tx.monthlySummary.count({ where });
        return { monthlySummaries, total };
    });
};

export const deleteSummary = async (id) =>
    await prisma.monthlySummary.delete({ where: { id } });

// // src/services/summary.service.js
// import prisma from "../db/prisma.js";
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween.js";
// import minMax from "dayjs/plugin/minMax.js";
// import pkg from "@prisma/client";

// dayjs.extend(isBetween);
// dayjs.extend(minMax);

// const { Decimal } = pkg;

// // ------------------------ INVESTMENT -------------------------
// const getInvestment = async (tx, { sm, sy }) => {
//     const startDate = new Date(sy, sm - 1, 1);
//     const endDate = new Date(sy, sm, 0);

//     return await tx.investment.findFirst({
//         where: {
//             date: { gte: startDate, lte: endDate },
//         },
//     });
// };

// // ---------------------- MONTHLY GENERATOR ---------------------
// export const generateSummary = async (tx, { month, year }) => {
//     const sDate = new Date(year, month - 1, 1);
//     const eDate = new Date(year, month, 0);

//     // Manual Transactions
//     const manualTransactions = await tx.manualTransaction.findMany({
//         where: {
//             date: { gte: sDate, lt: eDate },
//         },
//     });

//     const sumByType = (type) =>
//         manualTransactions
//             .filter((m) => m.type === type)
//             .reduce((a, b) => a + (Number(b.amount) || 0), 0);

//     const totalExpense = sumByType("EXPENSE");
//     const totalDebtIncurred = sumByType("DEBT");
//     const totalCash = sumByType("CASH");
//     const totalBank = sumByType("BANK");

//     // Sales
//     const sales = await tx.sale.findMany({
//         where: {
//             saleDate: { gte: sDate, lt: eDate },
//         },
//         include: { product: true, customer: true },
//     });

//     const totalSalesRevenue = sales.reduce(
//         (sum, s) => sum + Number(s.totalAmount || 0),
//         0
//     );

//     const costOfStock = sales.reduce(
//         (sum, s) => sum + (Number(s.buyingPrice) * Number(s.quantity)),
//         0
//     );

//     const grossProfit = totalSalesRevenue - costOfStock;
//     const netProfit = grossProfit - totalExpense;

//     const totalDebtOnCustomers = sales.reduce(
//         (sum, s) => sum + Number(s.remainingAmount || 0),
//         0
//     );

//     // Products updated this month (not ongoing)
//     const products = await tx.product.findMany({
//         where: {
//             stockTransaction: {
//                 some: {
//                     date: { gte: sDate, lt: eDate },
//                 },
//             },
//         },
//         include: {
//             stockTransaction: {
//                 select: { id: true, date: true, quantity: true },
//                 orderBy: { date: "desc" },
//             },
//         },
//     });

//     const currentStockValue = products.reduce(
//         (sum, p) => sum + Number(p.stockQuantity) * Number(p.sellingPrice),
//         0
//     );

//     const totalStockQuantity = products.reduce(
//         (sum, p) => sum + Number(p.stockQuantity),
//         0
//     );

//     const totalProducts = products.length;

//     const investmentRecord = await getInvestment(tx, { sm: month, sy: year });
//     const totalInvestment = investmentRecord?.investment || 0;

//     const totalAssetsValue = currentStockValue + totalSalesRevenue;

//     const metrics = {
//         month,
//         year,

//         // Monthly/range based
//         totalExpense,
//         totalDebt: totalDebtIncurred,
//         totalBank,
//         totalCash,
//         totalInvestment,
//         totalAssetsValue,
//         totalSales: totalSalesRevenue,
//         costOfStock,
//         grossProfit,
//         netProfit,

//         // These will later be overridden with REAL-TIME values in getSummary()
//         stockValue: currentStockValue,
//         totalDebtOnCustomers,
//         totalProducts,
//         totalStockQuantity,
//     };

//     return await tx.monthlySummary.upsert({
//         where: { year_month: { month, year } },
//         update: metrics,
//         create: metrics,
//     });
// };

// // -------------------------- RANGE UTILS ------------------------
// function getMonthRange(sm, sy, em, ey) {
//     const result = [];
//     let start = sy * 12 + (sm - 1);
//     let end = ey * 12 + (em - 1);

//     if (start > end) [start, end] = [end, start];

//     for (let i = start; i <= end; i++) {
//         const year = Math.floor(i / 12);
//         const month = (i % 12) + 1;
//         result.push({ month, year });
//     }

//     return result;
// }

// function normalizeRange(sm, sy, em, ey) {
//     const currentYear = new Date().getFullYear();
//     sy = sy || currentYear;
//     ey = ey || sy;

//     if (sm && sy && !em && !ey)
//         return { from: { month: sm, year: sy }, to: { month: sm, year: sy } };

//     if (em && ey && !sm && !sy)
//         return { from: { month: em, year: ey }, to: { month: em, year: ey } };

//     if (!sm) sm = new Date().getMonth() + 1;
//     if (!em) em = sm;
//     if (!sy) sy = currentYear;
//     if (!ey) ey = sy;

//     let startIndex = sy * 12 + (sm - 1);
//     let endIndex = ey * 12 + (em - 1);

//     if (startIndex > endIndex) [sm, sy, em, ey] = [em, ey, sm, sy];

//     return {
//         from: { month: sm, year: sy },
//         to: { month: em, year: ey },
//     };
// }

// // ---------------------------- GET SUMMARY --------------------------
// export const getSummary = async (data) => {
//     const { sMonth: sm, sYear: sy, eMonth: em, eYear: ey } = data;

//     return await prisma.$transaction(async (tx) => {
//         const dateRange = [];
//         const today = new Date();

//         const currentMonth = today.getMonth() + 1;
//         const currentYear = today.getFullYear();

//         // Range Logic
//         if (sm && sy && em && ey) {
//             getMonthRange(sm, sy, em, ey).forEach((r) => dateRange.push(r));
//         } else if (!sm && !sy && !em && !ey) {
//             dateRange.push({ month: currentMonth, year: currentYear });
//         } else if (sm && sy && !em && !ey) {
//             dateRange.push({ month: sm, year: sy });
//         } else if (sm && !sy && !em && !ey) {
//             dateRange.push({ month: sm, year: currentYear });
//         } else if (!sm && sy && !em && !ey) {
//             for (let i = 1; i <= 12; i++)
//                 dateRange.push({ month: i, year: sy });
//         } else if (!sm && !sy && em && !ey) {
//             dateRange.push({ month: em, year: currentYear });
//         } else if (!sm && !sy && !em && ey) {
//             for (let i = 1; i <= 12; i++)
//                 dateRange.push({ month: i, year: ey });
//         } else if (sm && !sy && em && !ey) {
//             getMonthRange(sm, currentYear, em, currentYear).forEach((r) =>
//                 dateRange.push(r)
//             );
//         } else if (!sm && sy && em && !ey) {
//             getMonthRange(1, sy, em, sy).forEach((r) => dateRange.push(r));
//         } else if (sm && sy && !em && ey) {
//             getMonthRange(sm, sy, 12, ey).forEach((r) => dateRange.push(r));
//         }

//         // Get summaries (range-based)
//         const summaries = [];

//         for (const { month, year } of dateRange) {
//             const summary = await tx.monthlySummary.findUnique({
//                 where: { year_month: { month, year } },
//             });

//             if (summary) {
//                 const { id, createdAt, totalCustomers, totalProducts, ...rest } =
//                     summary;
//                 summaries.push(rest);
//             }
//         }

//         // Aggregate range summary
//         const summary = summaries.reduce((acc, obj) => {
//             for (const key in obj) {
//                 acc[key] = (acc[key] || 0) + Number(obj[key] || 0);
//             }
//             return acc;
//         }, {});

//         // --------------------- REAL-TIME (ONGOING VALUES) ---------------------
//         const ongoing = {};

//         ongoing.totalProducts = await tx.product.count();
//         ongoing.totalCustomers = await tx.customer.count();

//         const allProducts = await tx.product.findMany();

//         ongoing.totalStockQuantity = allProducts.reduce(
//             (sum, p) => sum + Number(p.stockQuantity),
//             0
//         );

//         ongoing.stockValue = allProducts.reduce(
//             (sum, p) => sum + Number(p.stockQuantity) * Number(p.sellingPrice),
//             0
//         );

//         const debtAgg = await tx.sale.aggregate({
//             _sum: { remainingAmount: true },
//         });

//         ongoing.totalDebtOnCustomers = Number(debtAgg._sum.remainingAmount || 0);

//         summary.totalProducts = ongoing.totalProducts;
//         summary.totalCustomers = ongoing.totalCustomers;
//         summary.totalStockQuantity = ongoing.totalStockQuantity;
//         summary.stockValue = ongoing.stockValue;
//         summary.totalDebtOnCustomers = ongoing.totalDebtOnCustomers;

//         // Compute assets = (Real-time stock value + range-based sales)
//         summary.totalAssetsValue =
//             ongoing.stockValue + (summary.totalSales || 0);

//         // Range label
//         const range = normalizeRange(sm, sy, em, ey);
//         summary.from = range.from;
//         summary.to = range.to;

//         return summary;
//     });
// };

// // ---------------------------- PAGINATED SUMMARIES ------------------------
// export const getSummaries = async (where, { page, limit }) => {
//     return await prisma.$transaction(async (tx) => {
//         const monthlySummaries = await tx.monthlySummary.findMany({
//             where,
//             skip: (page - 1) * limit,
//             take: limit,
//         });

//         const total = await tx.monthlySummary.count({ where });
//         return { monthlySummaries, total };
//     });
// };

// // ------------------------------ DELETE SUMMARY ----------------------------
// export const deleteSummary = async (id) =>
//     await prisma.monthlySummary.delete({ where: { id } });
