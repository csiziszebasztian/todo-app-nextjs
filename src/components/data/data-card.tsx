import React from "react";
import {Card} from "@/components/ui/card";
import {CardHeader} from "@/components/ui/card";
import {CardTitle} from "@/components/ui/card";
import {CardContent} from "@/components/ui/card";

interface DataCardProps {
    title?: string,
    icon?: React.ReactNode,
    value?: number,
    prevValue?: number,
    isChangeShow?: boolean
    postFix?: string
}

export default function DataCard({
                                     title,
                                     icon,
                                     value,
                                     prevValue,
                                     postFix = ""
                                 }: DataCardProps) {

    const change = (typeof value !== 'undefined' && typeof prevValue !== 'undefined') ? value - prevValue : "";

    let colorClass = "text-muted-foreground";
    if(typeof change === "number") {
        if (change < 0) {
            colorClass = "text-destructive";
        } else if (change > 0) {
            colorClass = "text-done";
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value} {postFix}</div>
                    <p className={`text-xs ${colorClass}`}>
                        {change} {change !== "" ? postFix : ""}
                    </p>
            </CardContent>
        </Card>
    );
}