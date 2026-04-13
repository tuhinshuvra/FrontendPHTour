/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddNewDivisionMutation } from "@/redux/features/division/division.api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddDivisionModal() {
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState<File | null>(null)
    const [addDivision] = useAddNewDivisionMutation();

    // console.log("Inside add division modal", image);
    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (data) => {
        const toastId = toast.loading("Adding...");
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        formData.append("file", image as File);

        try {
            const res = await addDivision(formData).unwrap();

            if (res.success) {
                toast.success("Successfully  added division", { id: toastId })
                setOpen(false);

            }
            // console.log("Add Division: ", res);

        } catch (error: any) {
            console.log(error);
            toast.error(
                error?.data?.message || "Division already exists",
                { id: toastId }
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add Division</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Division</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form id="add-division" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Division Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Division Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)
                            }
                        />

                        <br />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)
                            }
                        />
                        <br />

                    </form>
                    <SingleImageUploader
                        onChange={setImage}
                    />
                </Form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button disabled={!image} type="submit" form="add-division">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}