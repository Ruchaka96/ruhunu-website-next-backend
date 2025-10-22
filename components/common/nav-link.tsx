"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // if you have a classnames helper; otherwise inline strings

type NavLinkProps = {
    href: string;
    label: string;
    icon: React.ReactNode;
    exact?: boolean; // if true, match path exactly
    className?: string;
};

export function NavLink({ href, label, icon, exact, className }: NavLinkProps) {
    const pathname = usePathname();

    // active when current path starts with href (or exact match when exact=true)
    const isActive = exact ? pathname === href : pathname?.startsWith(href);

    return (
        <Link
            href={href}
            className={cn(
                // layout: full width, left aligned
                "w-full flex items-center justify-start gap-3",
                // spacing + shape
                "px-3 py-2 rounded-lg",
                // typography
                "text-sm font-medium",
                // colors & states
                isActive
                    ? "bg-[#1B1B53] text-white"
                    : "text-white hover:text-gray-500 hover:bg-white/10",
                // focus ring
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                className
            )}
        >
            {/* Icon on the left */}
            <span className="shrink-0">
                {icon}
            </span>

            {/* Text left-aligned, truncate if long */}
            <span className="truncate">{label}</span>
        </Link>
    );
}
