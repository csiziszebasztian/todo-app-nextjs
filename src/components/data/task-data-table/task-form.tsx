import * as z from "zod";
import {Form} from "@/components/ui/form";
import {FormField} from "@/components/ui/form";
import {FormItem} from "@/components/ui/form";
import {FormLabel} from "@/components/ui/form";
import {FormControl} from "@/components/ui/form";
import {FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {SelectTrigger} from "@/components/ui/select";
import {SelectValue} from "@/components/ui/select";
import {SelectContent} from "@/components/ui/select";
import {SelectGroup} from "@/components/ui/select";
import {SelectItem} from "@/components/ui/select";
import {statuses} from "@/components/data/task-data-table/task-data";
import {priorities} from "@/components/data/task-data-table/task-data";
import {DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons/icons";
import {useTransition} from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TaskSchema} from "@/schemas";
import {Textarea} from "@/components/ui/textarea";
import {DateTimePicker} from "@/components/ui/date-time-picker";
import MultipleSelector from "@/components/ui/multi-selector";
import {Option} from "@/components/ui/multi-selector";
import {Task} from "@/schemas";
import {Category} from "@/schemas";

interface TaskForm {
    data?: Task,
    categories?: Category[],
    onSubmit: (values: z.infer<typeof TaskSchema>) => void,
}

export default function TaskForm(
    {
        data,
        categories,
        onSubmit
    }: TaskForm) {

    const [isLoading, startTransition] = useTransition();
    const [startTime, setStartTime] = useState<string>();

    const getCategories = () => {
        const options: Option[] = [];
        categories?.forEach((category) => {
            if (category.id) {
                options.push({
                    value: category.id,
                    label: category.name
                })
            }
        });
        return options;
    }


    const form = useForm<z.infer<typeof TaskSchema>>({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            id: data?.id,
            title: data?.title,
            description: data?.description,
            status: data?.status,
            priority: data?.priority,
            startedAt: data?.startedAt,
            finishedAt: data?.finishedAt,
            categories: data?.categories
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="title" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="description"
                                              value={field.value ?? ""}
                                              onChange={field.onChange}
                                              name={field.name}
                                              ref={field.ref}
                                              onBlur={field.onBlur}
                                              disabled={field.disabled}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-5">
                        <FormField
                            control={form.control}
                            name="startedAt"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Start Date & Time</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            errorMessage={form.formState?.errors?.startedAt?.message}
                                            granularity="second"
                                            jsDate={field.value}
                                            onJsDateChange={field.onChange}
                                            hourCycle={24}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="finishedAt"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>End Date & Time</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            errorMessage={form.formState?.errors?.finishedAt?.message}
                                            granularity="second"
                                            jsDate={field.value}
                                            onJsDateChange={field.onChange}
                                            hourCycle={24}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-5">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {statuses.map(status => {
                                                    return <SelectItem key={status.value}
                                                                       value={status.value}
                                                    >
                                                        <div className="flex items-center">
                                                            {status.icon && (
                                                                <status.icon
                                                                    className="mr-2 h-4 w-4 text-muted-foreground"/>
                                                            )}
                                                            {status.label}
                                                        </div>

                                                    </SelectItem>
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Priority</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {priorities.map(priority => {
                                                    return <SelectItem key={priority.value}
                                                                       value={priority.value}>
                                                        <div className="flex items-center">
                                                            {priority.icon && (
                                                                <priority.icon
                                                                    className="mr-2 h-4 w-4 text-muted-foreground"/>
                                                            )}
                                                            {priority.label}
                                                        </div>
                                                    </SelectItem>
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="categories"
                        render={({field}) => (
                             <FormItem className="flex-1">
                                 <FormLabel>Frameworks</FormLabel>
                                 <FormControl>
                                     <MultipleSelector
                                         value={field.value ?? undefined}
                                         onChange={field.onChange}
                                         defaultOptions={getCategories()}
                                         placeholder="Select category..."
                                         emptyIndicator={
                                             <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                 no results found.
                                             </p>
                                         }
                                     />
                                 </FormControl>
                                 <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Save
                        </Button>
                    </DialogFooter>
                </div>
            </form>
        </Form>
    )
}