import { LoadingSpinner } from "@/components/icons"
import React from "react"

export default function Loading() {
    return (
        <div className="fixed inset-0 sm:left-56 z-50 grid place-items-center bg-background/50">
            <div className="text-center text-primary-forground text-3xl">
                <LoadingSpinner />
            </div>
        </div>
    )
}
