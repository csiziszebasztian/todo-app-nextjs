import {auth} from "@/auth/auth";
import {db} from "@/lib/db";
import {TaskStatus} from "@prisma/client";
import {DashboardCardData} from "@/types/data-table";

export interface DateRange {
    startDateTime?: Date,
    endDateTime?: Date
}

interface QueryTaskStatusHistoryCount {
    status: TaskStatus,
    count: bigint
}

export const getDashboardCurrentTaskStatus = async () => {
    try {

        const session = await auth();
        const userId = session?.user?.id;

        const groupedTask = await db.task.groupBy({
            by: "status",
            _count: {
                _all: true
            },
            where: {userId}
        });

        const queryHourSum:{ HOUR: number | null }[] = await db.$queryRaw`
            SELECT SUM(TIMESTAMPDIFF(HOUR, startedAt, finishedAt)) AS HOUR
            FROM Task
            WHERE userId = ${userId}
                AND startedAt IS NOT NULL
                AND finishedAt IS NOT NULL;
        `;

        const todo = Number(groupedTask?.find(d => d.status === "TODO")?._count?._all);
        const inProgress = Number(groupedTask?.find(d => d.status === "IN_PROGRESS")?._count?._all);
        const done = Number(groupedTask?.find(d => d.status === "DONE")?._count?._all);
        const hour = Number(queryHourSum[0].HOUR);

        const data: DashboardCardData = {
            todo: !Number.isNaN(todo) ? todo : 0,
            inProgress: !Number.isNaN(inProgress) ? inProgress : 0,
            done: !Number.isNaN(done) ? done : 0,
            hour: !Number.isNaN(hour) ? hour : 0
        };

        return data;

    } catch (error) {
        return null;
    }
}

export const getDashboardCardDataByDateRange = async (dateRange?: DateRange) => {

    try {

        const session = await auth();
        const userId = session?.user?.id;
        let queryTaskStatusHistoryCounts: QueryTaskStatusHistoryCount[];
        let queryHourSum: { HOUR: number | null }[];

        if (dateRange) {
            queryTaskStatusHistoryCounts = await db.$queryRaw`
            SELECT
                th.status,
                COUNT(*) as count
            FROM
                taskStatusHistory th
            JOIN
                task t ON th.taskId = t.id
            WHERE
                t.userId = ${userId} AND
                th.changedAt >= ${dateRange?.startDateTime} AND
                th.changedAt <= ${dateRange?.endDateTime}
            GROUP BY
                th.status;
            `;

            queryHourSum = await db.$queryRaw`
                SELECT SUM(TIMESTAMPDIFF(HOUR, startedAt, finishedAt)) AS HOUR
                FROM Task
                WHERE userId = ${userId}
                    AND startedAt >= ${dateRange?.startDateTime}
                    AND finishedAt <= ${dateRange?.endDateTime}
                    AND startedAt IS NOT NULL
                    AND finishedAt IS NOT NULL;
                `;
        } else {
            queryTaskStatusHistoryCounts = await db.$queryRaw`
            SELECT
                th.status,
                COUNT(*) as count
            FROM
                taskStatusHistory th
            JOIN
                task t ON th.taskId = t.id
            WHERE
                t.userId = ${userId}
            GROUP BY
                th.status;
            `;

            queryHourSum = await db.$queryRaw`
                SELECT SUM(TIMESTAMPDIFF(HOUR, startedAt, finishedAt)) AS HOUR
                FROM Task
                WHERE userId = ${userId}
                    AND startedAt IS NOT NULL
                    AND finishedAt IS NOT NULL;
                `;
        }

        const todo = Number(queryTaskStatusHistoryCounts?.find(d => d.status === "TODO")?.count);
        const inProgress = Number(queryTaskStatusHistoryCounts?.find(d => d.status === "IN_PROGRESS")?.count);
        const done = Number(queryTaskStatusHistoryCounts?.find(d => d.status === "DONE")?.count);
        const hour = Number(queryHourSum[0].HOUR);


        const data: DashboardCardData = {
            todo: !Number.isNaN(todo) ? todo : 0,
            inProgress: !Number.isNaN(inProgress) ? inProgress : 0,
            done: !Number.isNaN(done) ? done : 0,
            hour: !Number.isNaN(hour) ? hour : 0
        };

        return data;

    } catch (error) {
        return null;
    }
}


type QueryResult = {
    name: string;
    date: string;
    count: number;
};

export type TransformedResult = {
    date: string;
    Todo: number;
    'In progress': number,
    Done: number,
    [key: string]: any
};

export const getStatusHistoryByDateRange = async (dateRange?: DateRange) => {

    try {

        const session = await auth();
        const userId = session?.user?.id;
        let results: QueryResult[];

        if (dateRange) {
            results = await db.$queryRaw`
                SELECT
                    s.name AS name,
                    DATE_FORMAT(d.date, '%Y-%m-%d') AS date,
                    COUNT(th.id) AS count
                FROM
                    (SELECT 'TODO' AS name UNION ALL SELECT 'IN_PROGRESS' UNION ALL SELECT 'DONE') AS s
                CROSS JOIN
                    (SELECT DISTINCT DATE_FORMAT(th.changedAt, '%Y-%m-%d') AS date FROM taskStatusHistory th WHERE th.changedAt >= ${dateRange?.startDateTime} AND th.changedAt <= ${dateRange?.endDateTime}) AS d
                LEFT JOIN
                    taskStatusHistory th ON s.name = th.status AND DATE_FORMAT(th.changedAt, '%Y-%m-%d') = d.date
                LEFT JOIN
                    task t ON th.taskId = t.id
                WHERE
                    t.userId = ${userId}
                GROUP BY
                    s.name, d.date;
           `;
        } else {
            results = await db.$queryRaw`
                SELECT
                    s.name AS name,
                    DATE_FORMAT(d.date, '%Y-%m-%d') AS date,
                    COUNT(th.id) AS count
                FROM
                    (SELECT 'TODO' AS name UNION ALL SELECT 'IN_PROGRESS' UNION ALL SELECT 'DONE') AS s
                CROSS JOIN
                    (SELECT DISTINCT DATE_FORMAT(th.changedAt, '%Y-%m-%d') AS date FROM taskStatusHistory th) AS d
                LEFT JOIN
                    taskStatusHistory th ON s.name = th.status AND DATE_FORMAT(th.changedAt, '%Y-%m-%d') = d.date
                LEFT JOIN
                    task t ON th.taskId = t.id
                WHERE    
                    t.userId = ${userId}
                GROUP BY
                    s.name, d.date;
           `;
        }

        return transformData(results, dateRange)


    } catch (error) {
        return null;
    }
}

function generateDateRange(dateRange?: DateRange) {
    const start = dateRange?.startDateTime;
    const end = dateRange?.endDateTime;
    const dateArray = [];

    if(start && end) {
        while (start <= end) {
            dateArray.push(start.toISOString().split('T')[0]);
            start.setDate(start.getDate() + 1);
        }
    }

    return dateArray;
}

function transformData(data: QueryResult[], dateRange?: DateRange): TransformedResult[] {
    const dateRangeArray = generateDateRange(dateRange);
    return dateRangeArray.map(date => {
        const entry = data.filter(item => item.date === date);
        const result: TransformedResult = { date, Todo: 0, 'In progress': 0, Done: 0 };
        entry.forEach(item => {
            let status = item.name;
            // Convert "IN_PROGRESS" to "In Progress"
            if (status === 'IN_PROGRESS') {
                status = 'In Progress';
            }
            // Convert the status name to title case
            status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            // Ensure the status exists in the result object before assigning a value
            if (result.hasOwnProperty(status)) {
                result[status] = Number(item.count);
            }
        });
        return result;
    });
}

export interface CategoriesPopularity {
    id: string,
    name: string,
    image: string,
    taskCount: number
}

export const getCategoriesPopularity = async (dateRange?: DateRange) => {
    try {

        const session = await auth();
        const userId = session?.user?.id;
        let topCategories: CategoriesPopularity[];
        let lowestCategories: CategoriesPopularity[];

        if (dateRange) {
            topCategories = await db.$queryRaw`
                SELECT c.id, c.name, c.image, COUNT(ctt.B) as taskCount
                    FROM Category c
                    LEFT JOIN _categorytotask ctt ON ctt.A = c.id
                    WHERE c.userId = ${userId}
                    AND (ctt.B IN (
                        SELECT t.id FROM Task t
                        WHERE t.createdAt >= ${dateRange?.startDateTime}
                        AND t.createdAt <= ${dateRange?.endDateTime}
                    ) OR ctt.B IS NULL)
                    GROUP BY c.id, c.name, c.image
                    ORDER BY taskCount DESC
                    LIMIT 5;
           `;
            lowestCategories = await db.$queryRaw`
                SELECT c.id, c.name, c.image, COUNT(ctt.B) as taskCount
                    FROM Category c
                    LEFT JOIN _categorytotask ctt ON ctt.A = c.id
                    WHERE c.userId = ${userId}
                    AND (ctt.B IN (
                        SELECT t.id FROM Task t
                        WHERE t.createdAt >= ${dateRange?.startDateTime}
                        AND t.createdAt <= ${dateRange?.endDateTime}
                    ) OR ctt.B IS NULL)
                    GROUP BY c.id, c.name, c.image
                    ORDER BY taskCount ASC
                    LIMIT 5;
           `;
        }
        else {
            topCategories = await db.$queryRaw`
                SELECT c.id, c.name, c.image, COUNT(ctt.B) as taskCount
                    FROM Category c
                    LEFT JOIN _categorytotask ctt ON ctt.A = c.id
                    WHERE c.userId = ${userId}
                    AND (ctt.B IN (
                        SELECT t.id FROM Task t
                    ) OR ctt.B IS NULL)
                    GROUP BY c.id, c.name, c.image
                    ORDER BY taskCount DESC
                    LIMIT 5;
           `;
            lowestCategories = await db.$queryRaw`
                SELECT c.id, c.name, c.image, COUNT(ctt.B) as taskCount
                    FROM Category c
                    LEFT JOIN _categorytotask ctt ON ctt.A = c.id
                    WHERE c.userId = ${userId}
                    AND (ctt.B IN (
                        SELECT t.id FROM Task t
                    ) OR ctt.B IS NULL)
                    GROUP BY c.id, c.name, c.image
                    ORDER BY taskCount ASC
                    LIMIT 5;
           `;
        }

        const merged = [...topCategories, ...lowestCategories];

        const uniqueMerged = merged.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.id === item.id
                ))
        );

        return uniqueMerged.map(item => ({
            ...item,
            taskCount: Number(item.taskCount)
        }));

    } catch (error) {
        return null;
    }
}
