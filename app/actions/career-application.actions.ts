"use server"

import { deleteCareerApplications, deleteOneCareerApplication, getCareerApplicationById, getCareerApplications, updateOneCareerApplication } from "@/services/career-application.service"
import { GetCareerApplicationParams, GetCareerApplicationQuery, UpdateCareerApplicationDTO } from "@/types/careerapplication"
import { revalidatePath } from "next/cache"

// ========== Get all careers applictions with pagination/search ==========
export const getAllCareerApplications = async (filter: GetCareerApplicationParams) => {
    try {

        const newFilter: GetCareerApplicationQuery = {
            currentCareerId: filter.currentCareerId,
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }
        
        // Call Service
        return await getCareerApplications(newFilter)

    } catch (error: any) {
        console.error("getAllCareerApplications error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Update Career application ==========
export const updateCareerApplication = async (id: string, payload: UpdateCareerApplicationDTO) => {
    try {
        const updatedData = await updateOneCareerApplication(id, payload)

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

// ========== Get single career application data ==========
export const fetchCareerApplicationById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Career id not found");
        }

        const career = await getCareerApplicationById(id);

        if (!career) {
            throw new Error("Career application not found");
        }

        return career;
    } catch (error: any) {
        console.error("Error in fetch Career application ById:", error.message);
        throw new Error(error.message || "Unable to fetch Career application.");
    }
};


// ========== Delete bulk careers ==========
export const bulkDeleteCareerApplications = async (ids: string[]) => {

    try {

        await deleteCareerApplications(ids)
        revalidatePath('/careers')
        return true

    } catch (error: any) {
        console.log('bulkDeleteCareers error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single career ==========
export const deleteCareerApplication = async (id: string) => {
    try {
        const response = await deleteOneCareerApplication(id)
        revalidatePath('/careers')
        return true

    } catch (error: any) {
        console.log('delete Career error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}