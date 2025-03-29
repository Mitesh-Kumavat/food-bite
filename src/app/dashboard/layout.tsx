import type React from "react"
import type { Metadata } from "next"
import { MainSidebar } from "@/components/headers/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/components/headers/main-header"


export const metadata: Metadata = {
    title: "Dashboard Layout",
    description: "Dashboard layout for your app",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex overflow-hidden h-fit w-full">
            <SidebarProvider>
                <MainSidebar />
                <SidebarInset >
                    <Header />
                    <main className="p-6 ">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

