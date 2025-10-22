import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Career } from "@/types/career";
import { redirect } from "next/navigation";
import CareerFormTabs from "../career-form-tabs";

export default async function NewCareerPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const career: Career | null = null;
    
    const nextOrder = await getNextOrder("career");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Careers</h1>
            </div>
            <CareerFormTabs career={career} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}