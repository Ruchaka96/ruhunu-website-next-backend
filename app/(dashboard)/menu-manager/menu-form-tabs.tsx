"use client";

import { useToast } from "@/components/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "@/types/menu";
import { useRouter } from "next/navigation";
import React from "react";
import MenuForm from "./tabs/menu-form";
import MenuItemTable from "./tabs/menu-item-table";

type MenuFormProps = {
    menu: Menu | null;
    sessionRole?: string | undefined;
    order: number
};

const DISABLED_HINT =
    "Create the menu in Details first. Other tabs unlock after the menu is saved.";

export default function MenuFormTabs({ menu, sessionRole, order}: MenuFormProps) {
    const { toast } = useToast();

    // Track career across tabs; once Details creates it, others unlock
    const [currentMenu, setCurrentMenu] = React.useState<Menu | null>(menu);
    const [tab, setTab] = React.useState<
        "details" | "menuitems"
    >("details");
    const router = useRouter();

    const hasId = Boolean(currentMenu?.id);
    
    const styleClasses = React.useMemo(
        () => ({
            parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
            labelClassName: "text-sm text-black font-semibold capitalize",
            inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
        }),
        []
    );

    // After a successful details save, enable other tabs and advance
    const handleCreated = (created: Menu) => {
        setCurrentMenu(created);
        toast({
            variant: "success",
            title: "Created",
            description: "Menu created. You can now fill the other tabs.",
        });
        router.push(`/menu-manager/${created.id}`);
    };

    // Generic “updated” handler used by other tabs
    const handleUpdated = (updated: Menu, jumpTo?: typeof tab) => {
        setCurrentMenu(updated);
        if (jumpTo) setTab(jumpTo);
    };

    return (
        <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as any)}
            className="w-full"
        >
            {/* Tab header across the top */}
            <TabsList className="mb-2 flex justify-start gap-2 rounded-xl bg-muted p-1 bg-gray-200">
                <TabsTrigger
                    value="details"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
                    text-muted-foreground
                    hover:text-primary hover:bg-primary/10
                    data-[state=active]:bg-black data-[state=active]:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Details
                </TabsTrigger>
                <TabsTrigger
                    value="menuitems"
                    disabled={!hasId}
                    title={!hasId ? DISABLED_HINT : ""}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
                    text-muted-foreground
                    hover:text-primary hover:bg-primary/10
                    data-[state=active]:bg-black data-[state=active]:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Menu Items
                </TabsTrigger>
            </TabsList>

            {/* Content with card wrapper */}
            <TabsContent value="details" className="mt-0">
                <Card className="border shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <MenuForm 
                            menu={currentMenu}
                            sessionRole={sessionRole} 
                            order={order}
                            styleClasses={styleClasses}
                            onCreated={handleCreated}
                            onUpdated={(m: any) => handleUpdated(m, "menuitems")}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="menuitems" className="mt-0">
                <Card className="border shadow-sm">
                    <CardContent className="pt-6">
                        <MenuItemTable 
                            currentMenuId={currentMenu?.id} 
                            sessionRole={sessionRole}                            
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}