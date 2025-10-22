"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type AddNewLinkButtonProps = {
    href: string;
    /** optional custom icon */
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    prefetch?: boolean;
};

export default function AddNewLinkButton({
    href,
    icon: Icon = PlusCircle,
    className = "",
    size = "sm",
    prefetch,
}: AddNewLinkButtonProps) {
    return (
        <Button
            asChild
            size={size}
            className={[
                "gap-1 px-8 text-white bg-[#01012A] border hover:text-[#01012A] hover:bg-white hover:border",
                className,
            ].join(" ")}
        >
            <Link href={href} prefetch={prefetch} className="flex items-center">
                <PlusCircle />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add New
                </span>
            </Link>
        </Button>
    );
}
