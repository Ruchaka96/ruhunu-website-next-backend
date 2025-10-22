import { bulkDeleteCareers, getAllCareers } from "@/app/actions/career.actions";
import { fetchServerSession } from "@/lib/session";
import Loading from "../loading";
import { Suspense } from "react";
import { CustomDataTable } from "@/components/common/custom-data-table";
import { SearchInput } from "../search";
import AddNewLinkButton from "@/components/common/add-new-link-btn";
import { careerColumns } from "./columns";

type SearchParams = {
    searchParams?: Promise<{
        page?: string;
        limit?: string;
        keyword?: string;
    }>
}

export default async function Page ({searchParams} : SearchParams ) {

    const resolvedSearchParams = await searchParams;
    const session = await fetchServerSession()

    const { data, totalRecords } = await getAllCareers({
        page: resolvedSearchParams?.page,
        limit: resolvedSearchParams?.limit,
        keyword: resolvedSearchParams?.keyword,
    })

    return (
        <>
            <div className="flex items-center ">
                <div className="ml-auto flex items-center gap-4">
                    <div className="lg:block hidden relative flex-1 md:grow-0">
                        <SearchInput
                            name="keyword"
                            placeholder={"Search by name, email"}
                            className={"rounded-lg bg-background pl-8 w-full sm:w-auto"}
                        />
                    </div>
                    <AddNewLinkButton href="/careers/add" />
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
                        heading="Careers"
                        subHeading="Manage your careers here."
                        columns={careerColumns}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={bulkDeleteCareers}
                        page={resolvedSearchParams?.page}
                    />
                </Suspense>
            </div>
        </>
    )
}