export type Menu = {
    id?: string
    name: string
    visibility: boolean
    order: number
}

export type UpdateMenuDTO = Partial<Menu>;

export type GetMenusParams = {
    page?: string
    limit?: string
    keyword?: string
    role: string
}

export type GetMenusQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetMenusReturn = {
    data: Menu[]
    totalRecords: number
}