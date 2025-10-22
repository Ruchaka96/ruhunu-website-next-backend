import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const getLoggedInUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    return session.user;
};