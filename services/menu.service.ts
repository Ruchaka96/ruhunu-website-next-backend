"use server"

import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { GetMenusQuery, GetMenusReturn, Menu, UpdateMenuDTO } from "@/types/menu";

export const getMenus = async ({
    page,
    limit,
    keyword,
}: GetMenusQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser();

        const records = await prisma.menu.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { order: "asc" },
        })
        
        const totalRecords = await prisma.menu.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })
        
        const response: GetMenusReturn = {
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
export const saveMenu = async (menu: Menu) => {
    try {

        const user = await getLoggedInUser();

        console.log({user})

        const result = await prisma.menu.create({
            data: {
                ...menu,
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

// ========== Update menu ==========
export const updateOneMenu = async (id: string, payload: UpdateMenuDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.menu.update({
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
        console.log("updateOneMenu error ==> ", error)

        return {
            isError: false,
            error: "Update menu Error",
            data: null
        }
    }
}

// ========== Get single menu data ==========
export const getMenuById = async (id: string) => {

    try {
        const result = await prisma.menu.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk menu ==========
export const deleteMenus = async (ids: string[]) => {

    try {
        await prisma.menu.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteMenu error ==> ", error)
        throw new Error(error.message ?? "Deleting Menu Error")
    }
}

// ========== Delete single menu ==========
export const deleteOneMenu = async (id: string) => {
    try {
        await prisma.menu.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneMenu error ==> ", error)
        throw new Error(error.message ?? "Delete Menu Error")
    }
}