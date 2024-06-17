import * as z from "zod";
import {TaskStatus, TaskPriority} from "@prisma/client";

export const SignInSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()),
});

export const SignUpSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    })
})

const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});

export const TaskSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    title: z.string().min(1, "Title is required!"),
    description: z.string().optional().nullable(),
    status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
    priority: z.nativeEnum(TaskPriority).optional().default(TaskPriority.MEDIUM),
    startedAt: z.date().optional().nullable(),
    finishedAt: z.date().optional().nullable(),
    createdAt: z.date().optional().default(() => new Date()),
    categories: z.array(optionSchema).optional().nullable(),
}).superRefine(({startedAt, finishedAt}, ctx) => {
    if (!startedAt && finishedAt) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Started at is greater than end date.",
            fatal: true,
            path: ["startedAt"]
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Started at is greater than end date.",
            fatal: true,
            path: ["finishedAt"]
        });
    } else if (startedAt && finishedAt && startedAt >= finishedAt) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Started at is greater than end date.",
            fatal: true,
            path: ["startedAt"]
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Started at is greater than end date.",
            fatal: true,
            path: ["finishedAt"]
        });
    }

    return z.NEVER;
});

export type Task = z.infer<typeof TaskSchema>

export const CategorySchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    name: z.string().min(1, "Name is required!"),
    image: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    task: z.array(z.string()).optional().nullable(),
    createdAt: z.date().optional().default(() => new Date()),
});

export type Category = z.infer<typeof CategorySchema>