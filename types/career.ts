export type Career = {
    id?: string
    name: string
    slug: string
    short_desc: string
    ref_no: string
    description: string
    image?: string | null
    visibility: boolean
    order: number
    no_of_vacancies: number
    from_date: Date
    to_date: Date
    checklist?: any | null
}

// when updating (partial, not includes id)
export type UpdateCareerDTO = Partial<Career>;

export type GetCareersParams = {
    page?: string
    limit?: string
    keyword?: string
    visibility?: boolean
}

export type GetCareersQuery = {
    page: number
    limit: number
    keyword: string
    visibility?: boolean
}

export type GetCareersReturn = {
    data: Career[]
    totalRecords: number
}
