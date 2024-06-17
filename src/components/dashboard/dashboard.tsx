"use client"

import DataCard from "@/components/data/data-card";
import {Circle} from "lucide-react";
import {Timer} from "lucide-react";
import {CheckCircle} from "lucide-react";
import {Clock4} from "lucide-react";
import {Card} from "@/components/ui/card";
import {CardHeader} from "@/components/ui/card";
import {CardTitle} from "@/components/ui/card";
import {CardContent} from "@/components/ui/card";
import {CardDescription} from "@/components/ui/card";
import {DashboardCardData} from "@/types/data-table";
import {TransformedResult} from "@/data/dashboard";
import {CategoriesPopularity} from "@/data/dashboard";
import {Avatar} from "@/components/ui/avatar";
import {AvatarImage} from "@/components/ui/avatar";
import {AvatarFallback} from "@/components/ui/avatar";
import {CategoryIcons} from "@/components/icons/category-icons";
import {ResponsiveBar} from "@nivo/bar";
import {ScrollArea} from "@/components/ui/scroll-area";


interface DashboardProps {
    data: DashboardCardData | null;
    changeData?: DashboardCardData | null;
    statusChartData?: TransformedResult[] | null,
    categoryPopularity: CategoriesPopularity[] | null,
    numberOfCategory: number | null,
}

export default function Dashboard({
                                      data,
                                      changeData,
                                      statusChartData,
                                      categoryPopularity,
                                      numberOfCategory
                                  }: DashboardProps) {

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DataCard title="Todo" icon={<Circle/>} value={data?.todo} prevValue={changeData?.todo}/>
                <DataCard title="In progress" icon={<Timer/>} value={data?.inProgress}
                          prevValue={changeData?.inProgress}/>
                <DataCard title="Done" icon={<CheckCircle/>} value={data?.done} prevValue={changeData?.done}/>
                <DataCard title="Hour" icon={<Clock4/>} value={data?.hour} prevValue={changeData?.hour} postFix={"h"}/>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2 h-80">
                        <ResponsiveBar
                            data={statusChartData ?? []}
                            keys={[
                                "Todo",
                                "In progress",
                                "Done",
                            ]}
                            theme={{
                                legends: {
                                  text: {
                                      fontSize: 12,
                                      fontWeight: "bold",
                                      fill: "hsl(var(--foreground))"
                                  }
                                },
                                labels: {
                                  text: {
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      fill: "hsl(var(--foreground))"
                                  }
                                },
                                tooltip: {
                                    container: {
                                        background: "hsl(var(--background))",
                                    },
                                },
                                background: "hsl(var(--background))",
                                axis: {
                                    domain: {
                                        line: {
                                            stroke: "hsl(var(--foreground))"
                                        }
                                    },
                                    ticks: {
                                        line: {
                                            stroke: "hsl(var(--foreground))"
                                        },
                                        text: {
                                            fill: "hsl(var(--foreground))"
                                        }
                                    },
                                    legend: {
                                      text: {
                                          fill: "hsl(var(--foreground))"
                                      }
                                    }
                                }
                            }}
                            indexBy="date"
                            margin={{ top: 10, right: 110, bottom: 50, left: 50 }}
                            padding={0.3}
                            valueScale={{type: 'linear'}}
                            indexScale={{type: 'band', round: true}}
                            colors={["hsl(var(--todo))", "hsl(var(--in-progress))", "hsl(var(--done))"]}
                            borderColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        1.6
                                    ]
                                ]
                            }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Date',
                                legendPosition: 'middle',
                                legendOffset: 32,
                                truncateTickAt: 0,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Task",
                                legendPosition: "middle",
                                legendOffset: -40,
                                truncateTickAt: 0
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 110,
                                    translateY: 0,
                                    itemsSpacing: 10,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    symbolShape: "circle",
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1
                                            }
                                        }
                                    ],
                                    toggleSerie: true
                                }
                            ]}
                            layout="vertical"
                            motionConfig={{
                                duration: 300,
                                damping: 15,
                            }}
                            role="application"
                            ariaLabel="Nivo bar chart"
                            barAriaLabel={e => e.id + ": " + e.formattedValue + " in date: " + e.indexValue}
                            enableGridY={false}
                        />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Categories popularity</CardTitle>
                        <CardDescription>
                            From {numberOfCategory} categories.
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea>
                    <CardContent className="h-72">
                            <div className="space-y-8">
                                {categoryPopularity?.map(category => {
                                    const listArray = Object.entries(CategoryIcons)?.find((icon) => icon[0] === category.image);
                                    let image;

                                    if (Array.isArray(listArray)) {
                                        const [key, Icon] = listArray;
                                        image = <Icon/>
                                    } else {
                                        image = (
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={""} alt={category.name}/>
                                                <AvatarFallback>{category.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        )
                                    }
                                    return (
                                        <div key={category.id} className="flex items-center">
                                            {image}
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{category.name}</p>
                                            </div>
                                            <div className="ml-auto font-medium">Task: {category.taskCount}</div>
                                        </div>
                                    )
                                })}
                            </div>

                    </CardContent>
                    </ScrollArea>
                </Card>
            </div>
        </>
    )

}
