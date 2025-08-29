import { prismaClient } from "../lib/db";

export class TimeLineService {
    public static async getTimeLine() {
        const result = await prismaClient.$queryRaw<{ year: string; count: number }[]>`
        SELECT 
            EXTRACT(YEAR FROM "pubDate")::TEXT AS year,
            COUNT(*)::INT AS count
        FROM "MiniNews"
        GROUP BY year
        ORDER BY year DESC;
        `;

        console.log("Timeline result:", result);
        const data = Object.fromEntries(result.map(r => [r.year, r.count]));
        console.log("Timeline data:", data);
        return data;
    }

    public static async getTimeLineOfYear(year: number) {

        console.log("Getting timeline for year:", year);
        const result = await prismaClient.$queryRaw<{ month: string; count: number }[]>`
        SELECT 
            TRIM(TO_CHAR("pubDate", 'Month')) AS month,
            COUNT(*)::INT AS count
            FROM "MiniNews"
            WHERE EXTRACT(YEAR FROM "pubDate") = ${year}
            GROUP BY month, EXTRACT(MONTH FROM "pubDate")
            ORDER BY EXTRACT(MONTH FROM "pubDate");
        `;

        console.log("Timeline result:", result);
        const data = Object.fromEntries(result.map(r => [r.month.toLowerCase(), r.count]));
        console.log("Timeline data:", data);
        return data;
    }

    public static async getTimeLineOfMonth(month: string) {
        const monthNames = [
            "january", "february", "march", "april",
            "may", "june", "july", "august",
            "september", "october", "november", "december"
        ];

        type MonthName = typeof monthNames[number];

        const monthMap: Record<MonthName, number> = {
            january: 1, february: 2, march: 3, april: 4,
            may: 5, june: 6, july: 7, august: 8,
            september: 9, october: 10, november: 11, december: 12,
        };

        const lowerMonth = month.toLowerCase() as MonthName;
        const monthNum = monthMap[lowerMonth];
        if (!monthNum) throw new Error("Invalid month name, my liege");

        const result = await prismaClient.$queryRaw<{
            day: string;
            category: string;
            count: number;
        }[]>`
            SELECT 
                EXTRACT(DAY FROM "pubDate")::TEXT AS day,
                unnest("category") AS category,
                COUNT(*)::INT AS count
            FROM "MiniNews"
            WHERE EXTRACT(MONTH FROM "pubDate") = ${monthNum}
            GROUP BY day, category
            ORDER BY day;
        `;

        const grouped: Record<string, Record<string, number>> = {};

        for (const { day, category, count } of result) {
            if (!grouped[day]) grouped[day] = {};
            grouped[day][category] = count;
        }

        return grouped;
    }


    public static async getTimeLineOfDay(dateInt: number) {
        const date = new Date(dateInt);
        const dateOnly = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD

        const result = await prismaClient.$queryRaw<
            { category: string; count: number }[]
        >`
        SELECT 
            unnest("category") AS category,
            COUNT(*)::INT AS count
        FROM "MiniNews"
        WHERE "pubDate"::DATE = ${dateOnly}::DATE
        GROUP BY category;
    `;

        const data = Object.fromEntries(result.map(r => [r.category, r.count]));
        return data;
    }

}



