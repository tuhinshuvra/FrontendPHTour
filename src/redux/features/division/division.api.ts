import { baseApi } from "@/redux/baseApi";

export const divisionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addNewDivision: builder.mutation({
            query: (divisionData) => ({
                url: "/division/create",
                method: "POST",
                data: divisionData,
            }),
            invalidatesTags: ["DIVISION"],
        }),

        getAllDivisions: builder.query({
            query: () => ({
                url: "/division",
                method: "GET",
            }),
            providesTags: ["DIVISION"],
            transformResponse: (response) => response.data,
        }),

        removeDivision: builder.mutation({
            query: (divisionId) => ({
                url: `/division/${divisionId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DIVISION"],
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useAddNewDivisionMutation,
    useGetAllDivisionsQuery,
    useRemoveDivisionMutation
} = divisionApi;