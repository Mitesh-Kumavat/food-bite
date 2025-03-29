"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PenSquare } from "lucide-react"

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
            title: "Home",
            href: "/dashboard/",
            icon: Home,
        },
        {
            title: "Other routes",
            href: "/dashboard/other",
            icon: PenSquare,
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="p-2 pb-1">
                    <h2 className="text-xl font-bold">Your App Name</h2>
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

