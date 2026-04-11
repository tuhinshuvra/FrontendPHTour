import { AddTourTypeModal } from "@/components/modules/Admin/TourType/AddTourTypeModal";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { Trash2 } from "lucide-react";

const AddTourType = () => {
    const { data } = useGetTourTypesQuery(undefined);
    console.log("All Tour Type", data);


    return (
        <div className="w-full max-w-6xl mx-auto py-10">
            <div className=" rounded-xl border border-gray-200 dark:border-gray-800  overflow-hidden ">
                <div className="px-6 py-5  border-b flex justify-between">

                    <div className="">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Categories
                        </h2>
                        <p className="text-sm text-gray-400">
                            Manage your tour categories
                        </p>
                    </div>
                    <AddTourTypeModal></AddTourTypeModal>
                </div>

                <Table>
                    {/* Header */}
                    <TableHeader>
                        <TableRow className=" font-extrabold">
                            <TableHead className="w-16">SL</TableHead>
                            <TableHead className=" font-extrabold">Name</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        {data?.map((item: { name: string }, index: number) => (
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

                                <TableCell>
                                    <div className="flex justify-end">
                                        <button className="p-2 rounded-md hover:bg-gray-100    ">
                                            <Trash2 className="w-4 h-4 text-red-300 hover:text-red-600 " />
                                        </button>
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

export default AddTourType;