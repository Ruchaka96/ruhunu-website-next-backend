import { fetchServerSession } from "@/lib/session";
import { Suspense } from "react";
import Loading from "../loading";
import { CustomDataTable } from "@/components/common/custom-data-table";
import { SearchInput } from "../search";
import AddNewLinkButton from "@/components/common/add-new-link-btn";
import { bulkDeleteMenu, getAllMenus } from "@/app/actions/menu.actions";
import { menuColumns } from "./columns";

type SearchParams = {
    searchParams?: Promise<{
        page?: string;
        limit?: string;
        keyword?: string;
    }>
}

export default async function Page( { searchParams }:SearchParams ) {
    
    const resolvedSearchParams = await searchParams;
    const session = await fetchServerSession()
        
    const { data, totalRecords } = await getAllMenus({
        page: resolvedSearchParams?.page,
        limit: resolvedSearchParams?.limit,
        keyword: resolvedSearchParams?.keyword,
        role: session?.user?.role ?? ""
    })

    return (
        <>
            <div className="flex items-center ">
                <div className="ml-auto flex items-center gap-4">
                    <div className="lg:block hidden relative flex-1 md:grow-0">
                        <SearchInput
                            name="keyword"
                            placeholder={"Search by name"}
                            className={"rounded-lg bg-background pl-8 w-full sm:w-auto"}
                        />
                    </div>
                    <AddNewLinkButton href="/menu-manager/add" />
                </div>
            </div>
            <div className="lg:hidden mt-2 relative flex-1 md:grow-0">
                <SearchInput
                    name="keyword"
                    placeholder={"Search by name, email"}
                    className={"rounded-lg bg-background pl-8 w-full"}
                />
            </div>
            <div className="overflow-hidden">
                <Suspense fallback={<Loading />}>
                    <CustomDataTable
                        heading="Menu"
                        subHeading="Manage your menu here"
                        columns={menuColumns}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={bulkDeleteMenu}
                        page={resolvedSearchParams?.page}                    
                    />
                </Suspense>
            </div>
        </>
    )
}