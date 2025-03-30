"use client";

import React, { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

interface User {
    restaurantName: string;
    userName: string;
    email: string;
}

const Header = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/me");
                if (response.status === 200) {
                    setUser(response.data.data);
                } else {
                    console.error("Error fetching user data:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

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
                            {loading ? (
                                // Loading Skeleton
                                <Skeleton className="h-10 w-28 rounded-md" />
                            ) : (
                                <Button variant="outline">{user?.userName || "Unknown"}</Button>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 shadow-lg">
                            <DropdownMenuLabel className="text-base font-semibold">
                                {user?.restaurantName || "Unknown Restaurant"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2">
                                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.userName || "Unknown"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.email || "No Email"}</span>
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

                    <ModeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
