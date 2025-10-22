"use server"

import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { Career, GetCareersQuery, GetCareersReturn, UpdateCareerDTO } from "@/types/career"

// ========== Get all careers with pagination/search ==========
export const getCareers = async ({
    page,
    limit,
    keyword,
}: GetCareersQuery) => {
    const skip = page * limit

    try {

        //const user = await getLoggedInUser(); //get logged user data
        
        const records = await prisma.career.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.career.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })
        
        const response: GetCareersReturn = {
            data: records,
            totalRecords,
        }
        
        return response
    } catch (error) {
        console.error("getCareers error", error)
        throw new Error("Error getting careers data")
    }
}

// ========== Create career ==========
export const saveCareer = async (career: Career) => {

    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.career.create({
            data: {
                ...career,
                createdBy: user.id,
                createdAt: new Date()
            }
        })

        return {
            isError: false,
            error: "",
            data: result
        }

    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {

            if (error.code === "P2002") {

                return {
                    isError: true,
                    error: "Career with same slug already exists",
                    data: null
                }
            }

        }

        return {
            isError: false,
            error: "",
            data: null
        }
    }
}

// ========== Update career ==========
export const updateOneCareer = async (id: string, payload: UpdateCareerDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.career.update({
            data: {
                ...payload,
                updatedBy: user.id,
                updatedAt: new Date()
            },
            where: {
                id: id,
            },
        })

        return {
            isError: false,
            error: "",
            data: result
        }
    } catch (error: any) {
        console.log("updateOneCareer error ==> ", error)

        return {
            isError: false,
            error: "Update career Error",
            data: null
        }
    }
}

// ========== Get single career data ==========
export const getCareerById = async (id: string) => {

    try {
        const result = await prisma.career.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Careers ==========
export const deleteCareers = async (ids: string[]) => {

    try {
        await prisma.career.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteCareers error ==> ", error)
        throw new Error(error.message ?? "Deleting Careers Error")
    }
}

// ========== Delete single careers ==========
export const deleteOneCareer = async (id: string) => {
    try {
        await prisma.career.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneCareer error ==> ", error)
        throw new Error(error.message ?? "Delete Career Error")
    }
}