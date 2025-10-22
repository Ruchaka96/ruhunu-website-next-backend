import { fetchCareerById } from "@/app/actions/career.actions";
import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Career } from "@/types/career";
import { notFound, redirect } from "next/navigation";
import CareerFormTabs from "../career-form-tabs";

export default async function CareerEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const career : Career | null = await fetchCareerById(id);
    if (!career) notFound();

    const nextOrder = await getNextOrder("career");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Career And Applications</h1>
            </div>
            <CareerFormTabs career={career} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}