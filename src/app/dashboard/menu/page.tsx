"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, } from "@/components/ui/card"
import { Search, Plus, Filter, MoreHorizontal, Eye } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuItem {
    _id: string,
    name: string,
    activeOnMenu: true,
    category: string,
    price: number,
    ingredients: [
        {
            id: string,
            name: string,
            quantity: number,
            unit: string
        },
    ],
}

export default function MenuPage() {
    const [menu, setMenu] = useState<MenuItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const data = await axios.get("/api/restaurant/menu", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                setMenu(data.data)
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredMenu = menu.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Menu Management</h1>
                    <p className="text-sm">Manage your restaurant's menu items</p>
                </div>
                <Link href="/dashboard/menu/add">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Dish
                    </Button>
                </Link>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center gap-5">
                    <div className="w-full ">
                        <Skeleton className="h-10 w-" />
                    </div>
                    <Card className="w-full">
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                </div>
            )
            }

            {
                !isLoading && (
                    <>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search menu items..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                                <span className="sr-only">Filter</span>
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="p-4 py-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMenu.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell>₹ {item.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.activeOnMenu ? "outline" : "secondary"}>{item.activeOnMenu ? "Active" : "Inactive"}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )
            }
        </div >
    )
}

