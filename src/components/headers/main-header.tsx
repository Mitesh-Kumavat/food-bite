"use client";

import React, { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../theme-toggler";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserCircle2, LogOut, Mail } from "lucide-react";

interface User {
    restaurantName: string;
    userName: string;
    email: string;
}

const Header = () => {
    const router = useRouter();
    const [user, setUser] = React.useState<User>();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/me");
                console.log(response.data);
                if (response.status !== 200) {
                    console.error("Error fetching user data:", response.data.message);
                    return;
                }
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();

    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.get("/api/logout");
            if (response.status === 200) {
                localStorage.removeItem("userId");
                router.push("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };



    return (
        <header className="flex h-14 items-center gap-4 border-b px-4">
            <SidebarTrigger />
            <div className="flex w-full items-center justify-between">
                <h1 className="text-lg font-semibold tracking-wide"></h1>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}>{user?.userName}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 shadow-lg">
                            <DropdownMenuLabel className="text-base font-semibold">
                                {user?.restaurantName || "Restaurant Name"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2">
                                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.userName}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.email}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
