"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, Home, Menu, Package, ShoppingCart, Trash2 } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter } from "next/navigation"

export function MainSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await axios.get("/api/logout");
            if (response.status !== 200) {
                console.error("Error logging out:", response.data.message);
                return;
            }
            localStorage.removeItem("userId");
            router.push("/");
        } catch (error: Error | any) {
            console.log(error.message);
        }
    }

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
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link href={item.href} className="flex items-center">
                                    <item.icon className="mr-2 h-5 w-5" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-2 ">
                    {/* logout button  */}
                    <Button variant={'outline'} onClick={handleLogout} className="w-full">
                        Logout
                    </Button>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

