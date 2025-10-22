"use server"

import { deleteCareers, deleteOneCareer, getCareerById, getCareers, saveCareer, updateOneCareer } from "@/services/career.service"
import { Career, GetCareersParams, GetCareersQuery, UpdateCareerDTO } from "@/types/career"
import { revalidatePath } from "next/cache"

// ========== Get all careers with pagination/search ==========
export const getAllCareers = async (filter: GetCareersParams) => {
    try {

        const newFilter: GetCareersQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getCareers(newFilter)

    } catch (error: any) {
        console.error("getAllCareers error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create Career ==========
export const createNewCareer = async (payload: Career) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("Careers name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        // Call Service
        const savedData = await saveCareer(payload)

        revalidatePath('/careers')

        return savedData

    } catch (error: any) {
        console.error("createNewCareers error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update Career ==========
export const updateCareer = async (id: string, payload: UpdateCareerDTO) => {
    try {
        const updatedData = await updateOneCareer(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneCareers error ==> ", error)

        return {
            isError: false,
            error: "Update careers Error",
            data: null
        }
    }
}

// ========== Get single career data ==========
export const fetchCareerById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Career id not found");
        }

        const career = await getCareerById(id);

        if (!career) {
            throw new Error("Career not found");
        }

        return career;
    } catch (error: any) {
        console.error("Error in fetch Career ById:", error.message);
        throw new Error(error.message || "Unable to fetch Career.");
    }
};


// ========== Delete bulk careers ==========
export const bulkDeleteCareers = async (ids: string[]) => {

    try {

        await deleteCareers(ids)
        revalidatePath('/careers')
        return true

    } catch (error: any) {
        console.log('bulkDeleteCareers error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single career ==========
export const deleteCareer = async (id: string) => {
    try {
        const response = await deleteOneCareer(id)
        revalidatePath('/careers')
        return true

    } catch (error: any) {
        console.log('delete Career error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}