"use client";

import CustomAlertDialog from "@/components/common/custom-alert-dialog";
import { CustomDialog } from "@/components/common/custom-dialog";
import { DataTableRowActions } from "@/components/common/custom-table-row-actions";
import { useToast } from "@/components/hooks/use-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MenuItem } from "@/types/menu-items";
import { deleteMenuItem } from "@/app/actions/menuitem.actions";
import MenuItemForm from "./menu-item-form";

interface MenuItemProps<TData extends MenuItem> {
    row: Row<TData>;
    onChange?: () => void;
    currentMenuId: string,
    sessionRole: string | undefined,
}

const MenuItemRecordActions = <TData extends MenuItem>({
    row,
    onChange,
    currentMenuId,
    sessionRole
}: MenuItemProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { data: session } = useSession();


    

    const menuitem = row.original;

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value);
    };

    const onDeleteConfirmation = async () => {
        if (!menuitem.id) return;
        try {
            setLoading(true);
            await deleteMenuItem(menuitem.id);
            toast({ variant: "success", title: "Deleted", description: "Menu Item deleted successfully" });
            onChange?.(); 
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err?.message || "Failed to delete" });
        } finally {
            setLoading(false);
            showHideDeleteModal(false);
        }
    };

    return (
        <>
            <DataTableRowActions>
                <DropdownMenuItem onClick={() => setShowViewDialog(true)}>View / Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => showHideDeleteModal(true)}>Delete</DropdownMenuItem>
            </DataTableRowActions>

            <CustomAlertDialog
                open={showDeleteConfirmation}
                handleVisibilityChange={showHideDeleteModal}
                loading={loading}
                title="Are you sure?"
                description="This action cannot be undone."
                handleContinue={onDeleteConfirmation}
            />

            <CustomDialog open={showViewDialog} setOpen={setShowViewDialog} title="Edit Application" width="800px">
                <MenuItemForm
                    menuItem={menuitem}
                    sessionRole={sessionRole}
                    currentMenuId={currentMenuId || ""}
                />
            </CustomDialog>
        </>
    );
};

export default MenuItemRecordActions;
