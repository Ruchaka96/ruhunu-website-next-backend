"use server"

import { deleteDocters, deleteOneDocter, getDocterById, getDocters, saveDocter, updateOneDocter } from "@/services/docter.service";
import { Docter, GetDoctersParams, GetDoctersQuery, UpdateDocterDTO } from "@/types/docter";
import { revalidatePath } from "next/cache";

// ========== Get all docters with pagination/search ==========
export const getAllDocters = async (filter: GetDoctersParams) => {
    try {

        const newFilter: GetDoctersQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getDocters(newFilter)

    } catch (error: any) {
        console.error("getAllDocters error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create docter ==========
export const createNewDocter = async (payload: Docter) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("Docter name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        // Call Service
        const savedData = await saveDocter(payload)

        revalidatePath('/docters')

        return savedData

    } catch (error: any) {
        console.error("createNewDocter error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update docter ==========
export const updateDocter = async (id: string, payload: UpdateDocterDTO) => {
    try {
        const updatedData = await updateOneDocter(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneDocter error ==> ", error)

        return {
            isError: false,
            error: "Update docter Error",
            data: null
        }
    }
}

// ========== Get single docter data ==========
export const fetchDocterById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Docter id not found");
        }

        const docter = await getDocterById(id);

        if (!docter) {
            throw new Error("Docter not found");
        }

        return docter;
    } catch (error: any) {
        console.error("Error in fetch docter ById:", error.message);
        throw new Error(error.message || "Unable to fetch docter.");
    }
};


// ========== Delete bulk docters ==========
export const bulkDeleteDocters = async (ids: string[]) => {

    try {

        await deleteDocters(ids)
        revalidatePath('/docters')
        return true

    } catch (error: any) {
        console.log('bulkDeletedocters error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single docter ==========
export const deleteDocter = async (id: string) => {
    try {
        const response = await deleteOneDocter(id)
        revalidatePath('/docters')
        return true

    } catch (error: any) {
        console.log('delete docter error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}