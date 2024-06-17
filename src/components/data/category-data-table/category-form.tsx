import * as z from "zod";
import {Form} from "@/components/ui/form";
import {FormField} from "@/components/ui/form";
import {FormItem} from "@/components/ui/form";
import {FormLabel} from "@/components/ui/form";
import {FormControl} from "@/components/ui/form";
import {FormMessage} from "@/components/ui/form";
import {FormDescription} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {CategoryIcons} from "@/components/icons/category-icons";
import {Icons} from "@/components/icons/icons";
import {useTransition} from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CategorySchema} from "@/schemas";
import {Textarea} from "@/components/ui/textarea";
import {Popover} from "@/components/ui/popover";
import {PopoverTrigger} from "@/components/ui/popover";
import {PopoverContent} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {ChevronsUpDown} from "lucide-react";
import {Check} from "lucide-react";
import {Command} from "@/components/ui/command";
import {CommandInput} from "@/components/ui/command";
import {CommandEmpty} from "@/components/ui/command";
import {CommandGroup} from "@/components/ui/command";
import {CommandItem} from "@/components/ui/command";
import {CommandList} from "@/components/ui/command";
import {ScrollArea} from "@/components/ui/scroll-area";


interface CategoryForm {
    id?: string,
    name?: string,
    description?: string,
    image?: string,
    onSubmit: (values: z.infer<typeof CategorySchema>) => void
}

export default function CategoryForm(
    {
        id,
        name,
        description,
        image,
        onSubmit
    }: CategoryForm) {

    const [isLoading, startTransition] = useTransition();
    const [startTime, setStartTime] = useState<string>();


    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            id,
            name,
            description,
            image
        },
    });


    const getComboBoxValue = (value: string | null | undefined) => {
        if (value) {
            const listArray = Object.entries(CategoryIcons)?.find((icon) => icon[0] === value);
            if (Array.isArray(listArray)) {
                const [key, Icon] = listArray;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex-initial">
                            <Icon/>
                        </div>
                        <div className="flex-initial">
                            {key}
                        </div>
                    </div>
                );
            }
        }
        return "Select image";
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="name"
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
                    <FormField
                        control={form.control}
                        name="image"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Icons</FormLabel>
                                <Popover modal>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-[300px] justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {getComboBoxValue(field?.value)}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search icon..."/>
                                            <CommandEmpty>No icon found.</CommandEmpty>
                                            <CommandList>
                                                <CommandGroup>
                                                    {Object.entries(CategoryIcons)?.map(([key, Icon]) => (
                                                        <CommandItem
                                                            value={key}
                                                            key={key}
                                                            onSelect={() => {
                                                                form.setValue("image", key)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    key === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-initial">
                                                                    <Icon/>
                                                                </div>
                                                                <div className="flex-initial">
                                                                    {key}
                                                                </div>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    This is the icon that will be used in the dashboard.
                                </FormDescription>
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