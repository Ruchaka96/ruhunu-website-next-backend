"use server"

import { deleteMenus, deleteOneMenu, getMenuById, getMenus, saveMenu, updateOneMenu } from "@/services/menu.service";
import { GetMenusParams, GetMenusQuery, Menu, UpdateMenuDTO } from "@/types/menu";
import { revalidatePath } from "next/cache";

// ========== Get all menu with pagination/search ==========
export const getAllMenus = async (filter:GetMenusParams) => {
    try {

        const newFilter: GetMenusQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getMenus(newFilter)

    } catch (error: any) {
        console.error("getAllDocters error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create menu ==========
export const createNewMenu = async (payload: Menu) => {
    try {

        // required validations
        if (!payload.name) {
            throw new Error("Menu name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;
        
        // Call Service
        const savedData = await saveMenu(payload)
        
        revalidatePath('/menu-manager')
        
        return savedData
    } catch (error: any) {
        console.error("createNewMenu error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update menu ==========
export const updateMenu = async (id: string, payload: UpdateMenuDTO) => {
    try {
        const updatedData = await updateOneMenu(id, payload)
        
        return updatedData
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
export const fetchMenuById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Menu id not found");
        }

        const menu = await getMenuById(id);

        if (!menu) {
            throw new Error("Menu not found");
        }

        return menu;
    } catch (error: any) {
        console.error("Error in fetch menu ById:", error.message);
        throw new Error(error.message || "Unable to fetch menu.");
    }
};

// ========== Delete bulk menu ==========
export const bulkDeleteMenu = async (ids: string[]) => {

    try {

        await deleteMenus(ids)
        revalidatePath('/menu-manager')
        return true

    } catch (error: any) {
        console.log('bulkDeleteMenu error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single menu ==========
export const deleteMenu = async (id: string) => {
    try {
        const response = await deleteOneMenu(id)
        revalidatePath('/menu-manager')
        return true

    } catch (error: any) {
        console.log('delete menu error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}