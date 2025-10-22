"use server"

import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { Docter, GetDoctersQuery, GetDoctersReturn, UpdateDocterDTO } from "@/types/docter";


// ========== Get all docters with pagination/search ==========
export const getDocters = async ({
    page,
    limit,
    keyword,
}: GetDoctersQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser(); //get logged user data

        const records = await prisma.docter.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.docter.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })

        const response: GetDoctersReturn = {
            data: records,
            totalRecords,
        }

        return response
    } catch (error) {
        console.error("getDocters error", error)
        throw new Error("Error getting docters data")
    }
}

// ========== Create docter ==========
export const saveDocter = async (docter: Docter) => {

    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.docter.create({
            data: {
                ...docter,
                code: "",
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

// ========== Update docter ==========
export const updateOneDocter = async (id: string, payload: UpdateDocterDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.docter.update({
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
        console.log("updateOneDocter error ==> ", error)

        return {
            isError: false,
            error: "Update docter Error",
            data: null
        }
    }
}

// ========== Get single docter data ==========
export const getDocterById = async (id: string) => {

    try {
        const result = await prisma.docter.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Docters ==========
export const deleteDocters = async (ids: string[]) => {

    try {
        await prisma.docter.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteDocters error ==> ", error)
        throw new Error(error.message ?? "Deleting Docters Error")
    }
}

// ========== Delete single docter ==========
export const deleteOneDocter = async (id: string) => {
    try {
        await prisma.docter.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneDocter error ==> ", error)
        throw new Error(error.message ?? "Delete Docter Error")
    }
}