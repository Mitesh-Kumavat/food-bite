"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, Home, Menu, Package, ShoppingCart, Trash2, Brain } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

export function MainSidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: Home,
        },
        {
            title: "Inventory",
            href: "/dashboard/inventory",
            icon: Package,
        },
        {
            title: "Menu",
            href: "/dashboard/menu",
            icon: Menu,
        },
        {
            title: "Sales",
            href: "/dashboard/sales",
            icon: ShoppingCart,
        },
        {
            title: "Waste",
            href: "/dashboard/waste",
            icon: Trash2,
        },
        {
            title: "Ai Menu",
            href: "/dashboard/ai-menu",
            icon: Brain,
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="p-2 pb-1">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <ChefHat className="h-6 w-6" />
                        <span>Foodbite</span>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="mt-2 px-2">
                    {navItems.map((item) => {
                        const isActive = item.href === "/dashboard"
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted hover:text-primary"
                                            } ${isActive ? "pointer-events-none" : ""}`}
                                    >
                                        <item.icon className={`mr-2 h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

