"use client";

import { CareerApplication } from "@/types/careerapplication";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "../../loading";
import { CustomDataTable } from "@/components/common/custom-data-table";
import { bulkDeleteCareerApplications, getAllCareerApplications } from "@/app/actions/career-application.actions";

type ApplicationTableProps = {
  currentCareerId: string | undefined;
  searchParams?: {
    page?: string;
    limit?: string;
    keyword?: string;
  };
  sessionRole: string | undefined;
};

export default function ApplicationTable({
  currentCareerId,
  searchParams,
  sessionRole,
}: ApplicationTableProps) {
    const router = useRouter();
    const [data, setData] = useState<CareerApplication[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    const fetchData = async () => {
        if (!currentCareerId) return;
    
        setLoading(true);
        try {
          const res = await getAllCareerApplications({
            currentCareerId,
            page: searchParams?.page,
            limit: searchParams?.limit,
            keyword: searchParams?.keyword,
          });
          setData(res.data ?? []);
          setTotalRecords(res.totalRecords ?? 0);
        } catch (error) {
          console.error("Error fetching menu items:", error);
        } finally {
          setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [currentCareerId, searchParams]);
    
    return (
        <>
            <div className="overflow-hidden">
                <Suspense fallback={<Loading />}>
                    <CustomDataTable
                        heading="Menu Items"
                        subHeading="Manage your menu items here."
                        // columns={careerApplicationColumns({
                        //   onChange: fetchData,
                        //   sessionRole: sessionRole,
                        //   currentCareerId: currentCareerId
                        // })}
                        columns={[]}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={bulkDeleteCareerApplications}
                        page={searchParams?.page}
                    />
                </Suspense>
            </div>
        </>
    )
}