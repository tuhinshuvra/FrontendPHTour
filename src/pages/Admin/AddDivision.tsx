import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddDivisionModal } from "@/components/modules/Admin/Division/AddDivisionModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllDivisionsQuery, useRemoveDivisionMutation } from "@/redux/features/division/division.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AddDivision = () => {
    const { data } = useGetAllDivisionsQuery(undefined);
    const [removeDivision] = useRemoveDivisionMutation();

    const handleRemoveDivision = async (tourId: string) => {
        toast.promise(
            removeDivision(tourId).unwrap(),
            {
                loading: "Removing...",
                success: "Removed Successfully ",
                error: "Failed to remove",
            }
        );
    };

    console.log("All Divisions: ", data);



    return (
        <div className="w-full max-w-6xl mx-auto py-10">
            <div className=" rounded-xl border border-gray-200 dark:border-gray-800  overflow-hidden ">
                <div className="px-6 py-5  border-b flex justify-between">

                    <div className="">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Divisions
                        </h2>
                        <p className="text-sm text-gray-400">
                            Manage all divisions
                        </p>
                    </div>
                    <AddDivisionModal></AddDivisionModal>
                </div>

                <Table>
                    {/* Header */}
                    <TableHeader>
                        <TableRow className=" font-extrabold">
                            <TableHead className="w-16">SL</TableHead>
                            <TableHead className=" font-extrabold">Name</TableHead>
                            <TableHead className=" font-extrabold">Image</TableHead>
                            <TableHead className=" font-extrabold">Details</TableHead>
                            <TableHead className=" font-extrabold">Slug</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        {data?.map((item: { _id: string; name: string, description: string, slug: string, }, index: number) => (
                            <TableRow
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <TableCell className="text-gray-400">
                                    {index + 1}
                                </TableCell>

                                <TableCell className="font-medium text-gray-400 ">
                                    {item?.name}
                                </TableCell>

                                <TableCell className="font-medium text-gray-400 ">
                                    <img
                                        src={item?.thumbnail || "/dummy-image.png"}
                                        alt="thumbnail"
                                        className="w-15 h-15 rounded-full object-cover"
                                    />
                                </TableCell>

                                <TableCell className="font-medium text-gray-400 ">
                                    {item?.description?.split(" ").slice(0, 9).join(" ")}
                                </TableCell>

                                <TableCell className="font-medium text-gray-400 ">
                                    {item?.slug}
                                </TableCell>

                                <TableCell>
                                    <div className="flex justify-end">
                                        <DeleteConfirmation
                                            onConfirm={() => handleRemoveDivision(item._id)}
                                        >
                                            <button className="p-2 rounded-md hover:bg-gray-100    ">
                                                <Trash2 className="w-4 h-4 text-red-300 hover:text-red-600 " />
                                            </button>
                                        </DeleteConfirmation>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AddDivision;