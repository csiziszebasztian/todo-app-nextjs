import {CalendarDateRangePicker} from "@/components/date/date-range-picker";
import {Button} from "@/components/ui/button";
import {Tabs} from "@/components/ui/tabs";
import {TabsList} from "@/components/ui/tabs";
import {TabsTrigger} from "@/components/ui/tabs";
import {TabsContent} from "@/components/ui/tabs";
import Dashboard from "@/components/dashboard/dashboard";
import {getDashboardCardDataByDateRange} from "@/data/dashboard";
import {getStatusHistoryByDateRange} from "@/data/dashboard";
import {getCategoriesPopularity} from "@/data/dashboard";
import {getDashboardCurrentTaskStatus} from "@/data/dashboard";
import {getNumberOfCategory} from "@/data/category";

enum TimePeriod {
    Yesterday,
    PreviousWeek,
    PreviousMonth,
    PreviousYear,
    Today,
    ThisWeek,
    ThisMonth,
    ThisYear
}

function getDateTimeRange(period: TimePeriod): { startDateTime: Date; endDateTime: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    switch (period) {
        case TimePeriod.Yesterday:
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            break;
        case TimePeriod.PreviousWeek:
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff - 7);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
        case TimePeriod.PreviousMonth:
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case TimePeriod.PreviousYear:
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31);
            break;
        case TimePeriod.Today:
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case TimePeriod.ThisWeek:
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
        case TimePeriod.ThisMonth:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        case TimePeriod.ThisYear:
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
            break;
        default:
            throw new Error('Invalid time period');
    }

    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0); // Start of the day
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999); // End of the day

    startDateTime.setMinutes(startDateTime.getMinutes() - startDateTime.getTimezoneOffset());
    endDateTime.setMinutes(endDateTime.getMinutes() - endDateTime.getTimezoneOffset());

    return {startDateTime, endDateTime};
}

export default async function DashboardPage() {

    const currentData = await getDashboardCurrentTaskStatus();
    const allData = await getDashboardCardDataByDateRange();
    const dayData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.Today));
    const weekData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.ThisWeek));
    const monthData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.ThisMonth));
    const yearData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.ThisYear));

    const yesterdayData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.Yesterday));
    const previousWeekData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.PreviousWeek));
    const previousMonthData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.PreviousMonth));
    const previousYearData = await getDashboardCardDataByDateRange(getDateTimeRange(TimePeriod.PreviousYear));

    const statusChartWeekData = await getStatusHistoryByDateRange(getDateTimeRange(TimePeriod.ThisWeek));

    const allCategoryPopularity = await getCategoriesPopularity();
    const dayCategoryPopularity = await getCategoriesPopularity(getDateTimeRange(TimePeriod.Today));
    const weekCategoryPopularity = await getCategoriesPopularity(getDateTimeRange(TimePeriod.ThisWeek));
    const monthCategoryPopularity = await getCategoriesPopularity(getDateTimeRange(TimePeriod.ThisMonth));
    const yearCategoryPopularity = await getCategoriesPopularity(getDateTimeRange(TimePeriod.ThisYear));
    const numberOfCategory = await getNumberOfCategory();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <CalendarDateRangePicker/>
                    <Button>Download</Button>
                </div>
            </div>
            <Tabs defaultValue="current" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="current">Current</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">
                        Week
                    </TabsTrigger>
                    <TabsTrigger value="month">
                        Month
                    </TabsTrigger>
                    <TabsTrigger value="year">
                        Year
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        All
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="space-y-4">

                    <Dashboard data={currentData} statusChartData={statusChartWeekData}
                               categoryPopularity={allCategoryPopularity}
                               numberOfCategory={numberOfCategory}
                    />
                </TabsContent>
                <TabsContent value="day" className="space-y-4">
                    <Dashboard data={dayData} changeData={yesterdayData}
                               statusChartData={statusChartWeekData}
                               categoryPopularity={dayCategoryPopularity}
                               numberOfCategory={numberOfCategory}
                    />
                </TabsContent>
                <TabsContent value="week" className="space-y-4">
                    <Dashboard data={weekData} changeData={previousWeekData}
                               statusChartData={statusChartWeekData}
                               categoryPopularity={weekCategoryPopularity}
                               numberOfCategory={numberOfCategory}
                    />
                </TabsContent>
                <TabsContent value="month" className="space-y-4">
                    <Dashboard data={monthData} changeData={previousMonthData}
                               statusChartData={statusChartWeekData}
                               categoryPopularity={monthCategoryPopularity}
                               numberOfCategory={numberOfCategory}
                    />
                </TabsContent>
                <TabsContent value="year" className="space-y-4">
                    <Dashboard data={yearData} changeData={previousYearData}
                               statusChartData={statusChartWeekData}
                               categoryPopularity={yearCategoryPopularity}
                               numberOfCategory={numberOfCategory}
                    />
                </TabsContent>
                <TabsContent value="all" className="space-y-4">
                    <Dashboard data={allData} statusChartData={statusChartWeekData}
                               categoryPopularity={allCategoryPopularity}
                               numberOfCategory={numberOfCategory}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}