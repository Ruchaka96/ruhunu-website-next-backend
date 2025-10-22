import { fetchServerSession } from "@/lib/session";
import { Menu } from "@/types/menu";

import { redirect } from "next/navigation";
import MenuFormTabs from "../menu-form-tabs";
import { getNextOrder } from "@/lib/utils/totalRecordCount";

export default async function NewMenuPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const menu: Menu | null = null;
    
    const nextOrder = await getNextOrder("menu");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create New Menu And Menu Items</h1>
            </div>
            <MenuFormTabs menu={menu} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}