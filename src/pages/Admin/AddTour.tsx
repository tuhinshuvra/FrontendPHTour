/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText, } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, formatISO } from "date-fns";
import { Banknote, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useAddTourMutation, useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { useGetAllDivisionsQuery } from "@/redux/features/division/division.api";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { useState } from "react";
import { FileMetadata } from "@/hooks/use-file-upload";
import { toast } from "sonner";

export default function AddTour() {
    const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);

    // console.log("Uploaded Images : ", images);

    const { data: divisionsData, isLoading: divisionLoading } = useGetAllDivisionsQuery(undefined);
    const { data: tourTypesData, isLoading: tourTypesLoading } = useGetTourTypesQuery(undefined);
    const [addTour] = useAddTourMutation();

    const divisionOptions = divisionsData?.map(
        (item: { _id: string; name: string }) => ({
            value: item._id,
            label: item.name,
        })
    );

    const tourTypesOptions = tourTypesData?.map(
        (item: { _id: string; name: string }) => ({
            value: item._id,
            label: item.name,
        })
    );

    type FormData = {
        title: string;
        location: string;
        departureLocation: string;
        arrivalLocation: string;
        division: string;
        tourType: string;
        startDate?: Date;
        endDate?: Date;
        maxGuest: number;
        minAge: number;
        costFrom: number;
        description: string;
        included: { value: string }[];
        excluded: { value: string }[];
        amenities: { value: string }[];
        tourPlan: { value: string }[];

    };

    const form = useForm<FormData>({
        defaultValues: {
            title: "",
            location: "",
            division: "",
            tourType: "",
            startDate: new Date(),
            endDate: new Date(),
            maxGuest: 0,
            minAge: 18,
            costFrom: 0,
            description: "",
            included: [{ value: "" }],
            excluded: [{ value: "" }],
            amenities: [{ value: "" }],
            tourPlan: [{ value: "" }],
            departureLocation: "",
            arrivalLocation: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "included",
    })

    const { fields: excludedFields, append: excludedAppend, remove: excludedRemove } = useFieldArray({
        control: form.control,
        name: "excluded",
    })

    const { fields: amenitiesFields, append: amenitiesAppend, remove: amenitiesRemove } = useFieldArray({
        control: form.control,
        name: "amenities",
    })

    const { fields: tourPlanFields, append: tourPlanAppend, remove: tourPlanRemove } = useFieldArray({
        control: form.control,
        name: "tourPlan",
    })

    // console.log("Include, excluded Fields : ", fields);

    const addTourDataSubmit = async (data: FormData) => {
        const toastId = toast.loading("Adding...");

        const tourData = {
            ...data,
            startDate: data.startDate ? formatISO(data.startDate) : null,
            endDate: data.endDate ? formatISO(data.endDate) : null,
            included: data.included.map((item: { value: string }) => item.value),
            excluded: data.excluded.map((item: { value: string }) => item.value),
            amenities: data.amenities.map((item: { value: string }) => item.value),
            tourPlan: data.tourPlan.map((item: { value: string }) => item.value),
            costFrom: Math.trunc(data.costFrom),
            maxGuest: Math.trunc(data.maxGuest),
            minAge: Math.trunc(data.minAge),
        };

        console.log("Tour Data: ", tourData);

        const formData = new FormData();
        formData.append("data", JSON.stringify(tourData));
        images.forEach((image) => formData.append("files", image as File))

        try {
            const res = await addTour(formData).unwrap()

            if (res.success) {
                toast.success("Successfully added new tour", { id: toastId })
            }
            console.log("Tour Form Data:", res);
        } catch (error) {
            console.log(error);
            toast.error(
                error?.data?.message || "Tour already exists",
                { id: toastId }
            );
        }

        form.reset();
    };

    return (
        <Card className="max-w-3xl mx-auto w-full">
            <CardHeader>
                <CardTitle>Add New Tour</CardTitle>
                <CardDescription>
                    Add new tour to the system
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(addTourDataSubmit)}>
                        <FieldGroup>
                            {/* Title */}
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Tour Title</FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="Enter tour title"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="location"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Tour Location</FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="Enter tour location"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="division"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Division</FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={divisionLoading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select division">
                                                        {
                                                            divisionOptions?.find(
                                                                (item: { label: string; value: string }) =>
                                                                    item.value === field.value)?.label
                                                        }
                                                    </SelectValue>
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {divisionOptions?.map(
                                                        (item: { label: string; value: string }) => (
                                                            <SelectItem
                                                                key={item.value}
                                                                value={
                                                                    item.value
                                                                }
                                                            >
                                                                {item.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                {/* Tour Type */}
                                <Controller
                                    name="tourType"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Tour Type
                                            </FieldLabel>

                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={tourTypesLoading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select tour type">
                                                        {
                                                            tourTypesOptions?.find((item: { label: string; value: string }) =>
                                                                item.value === field.value)?.label
                                                        }
                                                    </SelectValue>
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {tourTypesOptions?.map(
                                                        (item: { label: string; value: string }) => (
                                                            <SelectItem key={item.value} value={item.value} >
                                                                {item.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    "PPP"
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>

                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value || undefined
                                                        }
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date <
                                                            new Date(
                                                                new Date().setDate(
                                                                    new Date().getDate() -
                                                                    1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>

                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value || undefined
                                                        }
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date <
                                                            new Date(
                                                                new Date().setDate(
                                                                    new Date().getDate() -
                                                                    1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                <div className="h-full">
                                    <Controller
                                        name="description"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field className="h-full flex flex-col" data-invalid={fieldState.invalid}>

                                                <FieldLabel>Description</FieldLabel>

                                                <InputGroup className="flex-1 flex flex-col">
                                                    <InputGroupTextarea
                                                        {...field}
                                                        placeholder="Write tour description..."
                                                        rows={6}
                                                        maxLength={100}
                                                        className="flex-1"
                                                    />

                                                    <InputGroupAddon align="block-end">
                                                        <InputGroupText>
                                                            {field.value.length}/100
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>

                                <div className="h-full">
                                    <Field className="h-full flex flex-col">
                                        <FieldLabel>Upload Images</FieldLabel>
                                        <div className="flex-1">
                                            <MultipleImageUploader onChange={setImages} />
                                        </div>
                                    </Field>
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                <div className="h-full ">
                                    <div className="flex justify-between">
                                        <p className=" font-semibold">Included</p>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => append({ value: "" })}
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                    <div className="">
                                        {
                                            fields.map((item, index) => (
                                                <div key={item.id} className=" flex gap-1 my-1">
                                                    <Controller
                                                        name={`included.${index}.value`}
                                                        control={form.control}

                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>

                                                                <Input
                                                                    {...field}
                                                                    placeholder="Enter includes"
                                                                />
                                                                {fieldState.invalid && (
                                                                    <FieldError
                                                                        errors={[fieldState.error]}
                                                                    />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />
                                                    <Button
                                                        onClick={() => remove(index)}
                                                        type="button"
                                                        size="icon"
                                                    ><Trash2 />
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="h-full ">
                                    <div className="flex justify-between">
                                        <p className=" font-semibold">Excluded</p>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => excludedAppend({ value: "" })}
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                    <div className="">
                                        {
                                            excludedFields.map((item, index) => (
                                                <div key={item.id} className=" flex gap-1 my-1">
                                                    <Controller
                                                        name={`excluded.${index}.value`}
                                                        control={form.control}

                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <Input {...field} placeholder="Enter excludes" />
                                                                {fieldState.invalid && (
                                                                    <FieldError
                                                                        errors={[fieldState.error]}
                                                                    />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />
                                                    <Button
                                                        onClick={() => excludedRemove(index)}
                                                        type="button"
                                                        size="icon"
                                                    ><Trash2 />
                                                    </Button>
                                                </div>

                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

                                <div className="h-full ">
                                    <div className="flex justify-between">
                                        <p className=" font-semibold">Amenities</p>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => amenitiesAppend({ value: "" })}
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                    <div className="">
                                        {
                                            amenitiesFields.map((item, index) => (
                                                <div key={item.id} className=" flex gap-1 my-1">
                                                    <Controller
                                                        name={`amenities.${index}.value`}
                                                        control={form.control}

                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <Input {...field} placeholder="Enter amenities" />
                                                                {fieldState.invalid && (
                                                                    <FieldError
                                                                        errors={[fieldState.error]}
                                                                    />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />
                                                    <Button
                                                        onClick={() => amenitiesRemove(index)}
                                                        type="button"
                                                        size="icon"
                                                    ><Trash2 />
                                                    </Button>
                                                </div>

                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="h-full ">
                                    <div className="flex justify-between">
                                        <p className=" font-semibold">Tour Plan</p>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => tourPlanAppend({ value: "" })}
                                        >
                                            <Plus className="" />
                                        </Button>
                                    </div>
                                    <div className="">
                                        {
                                            tourPlanFields.map((item, index) => (
                                                <div key={item.id} className=" flex gap-1 my-1">
                                                    <Controller
                                                        name={`tourPlan.${index}.value`}
                                                        control={form.control}

                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <Input {...field} placeholder="Enter tourPlan" />
                                                                {fieldState.invalid && (
                                                                    <FieldError
                                                                        errors={[fieldState.error]}
                                                                    />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />
                                                    <Button
                                                        onClick={() => tourPlanRemove(index)}
                                                        type="button"
                                                        size="icon"
                                                    ><Trash2 />
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Controller
                                    name="minAge"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Minimum Age</FieldLabel>
                                            <div className=" relative flex items-center">
                                                <span className="absolute left-3">
                                                    Year :
                                                </span>
                                                <Input
                                                    type="number" {...field}
                                                    className="pl-12"
                                                    placeholder="Enter minimum age"
                                                />
                                                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                            </div>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="maxGuest"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Maximum Guest</FieldLabel>
                                            <Input
                                                type="number" {...field}
                                                className=""
                                                placeholder="Enter maximum guest"
                                            />
                                            {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="costFrom"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Cost From</FieldLabel>
                                            <div className=" relative flex items-center">
                                                <Banknote className="absolute left-3 w-4 h-4 text-green-800 pointer-events-none" />
                                                <Input
                                                    type="number" {...field}
                                                    className="pl-9"
                                                    placeholder="Enter tour cost"
                                                />
                                                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                            </div>
                                        </Field>
                                    )}
                                />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="departureLocation"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Departure Location</FieldLabel>
                                            <Input
                                                {...field}
                                                placeholder="Enter departure location"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="arrivalLocation"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Arrival location</FieldLabel>
                                            <Input
                                                {...field}
                                                placeholder="Enter arrival location"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                        </FieldGroup>
                    </form>
                </Form>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                >
                    Reset
                </Button>

                <Button type="submit" form="form-rhf-demo">
                    Create Tour
                </Button>
            </CardFooter>
        </Card>
    );
}