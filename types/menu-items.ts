export type MenuItem = {
    id?: string
    title: string
    url: string
    menuId: string | null
    parentId: string | null
    visible: boolean
    order: number
}

export type UpdateMenuItemDTO = Partial<MenuItem>;

export type GetMenuItemsParams = {
    currentMenuId?: string
    page?: string
    limit?: string
    keyword?: string
}

export type GetMenuItemsQuery = {
    currentMenuId?: string
    page: number
    limit: number
    keyword: string
}

export type GetMenuItemsReturn = {
    data: MenuItem[]
    totalRecords: number
}