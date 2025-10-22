import { fetchServerSession } from "@/lib/session";
import { Docter } from "@/types/docter";

import { redirect } from "next/navigation";
import DocterForm from "../docter-form";
import { getNextOrder } from "@/lib/utils/totalRecordCount";

export default async function NewDoctersPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const docters: Docter | null = null;
    
    const nextOrder = await getNextOrder("docter");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Docter</h1>
            </div>
            <DocterForm docter={docters} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}