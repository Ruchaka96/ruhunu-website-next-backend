"use server"

import prisma from "@/lib/prisma"
import { GetCareerApplicationQuery, GetCareerApplicationReturn, UpdateCareerApplicationDTO } from "@/types/careerapplication"

// ========== get all career applications ==========
export const getCareerApplications = async ({
    currentCareerId,
    page,
    limit,
    keyword,
}: GetCareerApplicationQuery) => {
    const skip = page * limit

    try {
        
        const records = await prisma.careerApplication.findMany({
            skip,
            take: limit,
            where: {careerId: currentCareerId},
            orderBy: { createdAt: "desc"}
        })

        const totalRecords = await prisma.careerApplication.count({
            where: {careerId: currentCareerId},
        });
        
        const response: GetCareerApplicationReturn = {
            data: records,
            totalRecords: totalRecords
        };
        
        return response

    } catch (error) {
        console.error("getCareersApplication error", error)
        throw new Error("Error getting career application data")
    }
}

// ========== update career applications ==========
export const updateOneCareerApplication = async (id: string, payload: UpdateCareerApplicationDTO) => {
    try {
    
        const result = await prisma.careerApplication.update({
            data: {
                ...payload,
                updatedAt: new Date()
            },
            where: {
                id: id,
            },
        })
    
        return {
            isE: true,
            error: "",
            data: result
        }
    
    } catch (error: any) {
        console.log("updateOneCareerApplication error ==> ", error)
    
        return {
            isError: false,
            error: "update Career Application Error",
            data: null
        }
    }
}

// ========== Get single career applications data ==========
export const getCareerApplicationById = async (id: string) => {

    try {
        const result = await prisma.careerApplication.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk careers application ==========
export const deleteCareerApplications = async (ids: string[]) => {

    try {
        await prisma.careerApplication.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteCareersApplication error ==> ", error)
        throw new Error(error.message ?? "Deleting careers application Error")
    }
}

// ========== Delete career application ==========
export const deleteOneCareerApplication = async (id: string) => {
    try {
        await prisma.careerApplication.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneCareerApplication error ==> ", error)
        throw new Error(error.message ?? "Delete career Application Error")
    }
}