import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircle,
    CircleIcon,
    Timer,
} from "lucide-react"
import {TaskStatus} from "@prisma/client";
import {TaskPriority} from "@prisma/client";

export const statuses = [
    {
        value: TaskStatus.TODO,
        label: "Todo",
        icon: CircleIcon,
    },
    {
        value: TaskStatus.IN_PROGRESS,
        label: "In Progress",
        icon: Timer,
    },
    {
        value: TaskStatus.DONE,
        label: "Done",
        icon: CheckCircle,
    },
]

export const priorities = [
    {
        value: TaskPriority.LOW,
        label: "Low",
        icon: ArrowDownIcon,
    },
    {
        value: TaskPriority.MEDIUM,
        label: "Medium",
        icon: ArrowRightIcon,
    },
    {
        value: TaskPriority.HIGH,
        label: "High",
        icon: ArrowUpIcon,
    },
]