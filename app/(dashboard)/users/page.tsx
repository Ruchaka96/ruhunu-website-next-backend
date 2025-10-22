import { fetchServerSession } from "@/lib/session";

type SearchParams = {
    searchParams?: Promise<{
        page?: string;
        limit?: string;
        keyword?: string;
    }>
}

export default async function Page ({ searchParams }: SearchParams) {
    const resolvedSearchParams = await searchParams;
    const session = await fetchServerSession()

    // const { data, totalRecords } = await getAllUsers({
    //     page: resolvedSearchParams?.page,
    //     limit: resolvedSearchParams?.limit,
    //     keyword: resolvedSearchParams?.keyword,
    //     role: session?.user?.role ?? ""
    // })


    return (
        <></>
    )
}