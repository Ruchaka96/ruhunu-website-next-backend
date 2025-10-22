"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SaveIcon, DisabledIcon } from "@/components/icons";

type FormActionsProps = {
    onCancelHref?: string;
    onCancel?: () => void;
    showSaveAndClose?: boolean;
    loading?: boolean;
    disabled?: boolean;
    onBeforeSubmit?: (type: "save" | "save-close") => void;
    onSubmitClick?: () => void; 
};

export function FormActionsBtns({
    onCancelHref,
    onCancel,
    showSaveAndClose = false,
    loading = false,
    disabled = false,
    onBeforeSubmit,
    onSubmitClick,
}: FormActionsProps) {
    const router = useRouter();

    const handleCancel = () => {
        if (onCancel) return onCancel();
        if (onCancelHref) return router.push(onCancelHref);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pe-2">
            {/* Cancel */}
            <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-24 gap-1 border-red-500 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                type="button"
                onClick={handleCancel}
                disabled={loading}
            >
                Cancel
            </Button>

            {/* Save & Close (optional) */}
            {showSaveAndClose && (
                <Button
                    disabled={disabled || loading}
                    size="sm"
                    name="action"
                    value="save-close"
                    type="button" // prevent auto-submit
                    onClick={() => {
                        onBeforeSubmit?.("save-close");
                        onSubmitClick?.();
                    }}
                    className="w-full sm:w-32 gap-1 text-[#1B1B53] border border-[#1B1B53] px-6 transition-colors hover:text-white hover:bg-[#01012A] bg-white"
                >
                    <SaveIcon />
                    Save & Close
                </Button>
            )}

            {/* Save */}
            <Button
                disabled={disabled || loading}
                size="sm"
                name="action"
                value="save"
                type="button" // prevent auto-submit
                onClick={() => {
                    onBeforeSubmit?.("save");
                    onSubmitClick?.();
                }}
                className="w-full sm:w-24 gap-1 text-[#1B1B53] border border-[#1B1B53] px-6 transition-colors hover:text-white hover:bg-[#01012A] bg-white"
            >
                <SaveIcon />
                Save
            </Button>
        </div>
    );
}