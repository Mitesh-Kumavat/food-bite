"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, AlertTriangle, Trash } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"

interface InventoryItem {
    _id: string,
    itemName: string,
    category: string,
    quantity: number,
    unit: string,
    purchasePrice: number,
    expiryDate: string,
}

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get("/api/restaurant/inventory", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                })

                const data = response.data;
                console.log(data, "DATA")
                setInventory(data)
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch inventory data", {
                    description: "Please try again later.",
                })
            } finally {
                setIsLoading(false)
            }
            // setInventory(mockInventoryData)
            setIsLoading(false)
        }

        fetchData()
    }, [])

    const filteredInventory = inventory.filter(
        (item) =>
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`/api/restaurant/inventory/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            toast.success("Item deleted successfully")
            setInventory((prevInventory) => prevInventory.filter((item) => item._id !== id))
        } catch (error) {
            console.log(error)
            toast.error("Failed to delete item", {
                description: "Please try again later.",
            })
        }
    }

    const getStatusBadge = (daysUntilExpiry: number) => {
        if (daysUntilExpiry <= 0) {
            return <Badge variant="destructive">Expired</Badge>
        } else if (daysUntilExpiry <= 3) {
            return (
                <Badge variant="destructive" className="bg-amber-500">
                    Expiring Soon
                </Badge>
            )
        } else if (daysUntilExpiry <= 7) {
            return (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                    Warning
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="border-green-500 text-green-500">
                    Good
                </Badge>
            )
        }
    }

    const getStockBadge = (quantity: number, minStock: number) => {
        if (quantity <= 0) {
            return <Badge variant="destructive">Out of Stock</Badge>
        } else if (quantity <= minStock) {
            return (
                <Badge variant="destructive" className="bg-amber-500">
                    Low Stock
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="border-green-500 text-green-500">
                    In Stock
                </Badge>
            )
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold">Inventory Management</h2>
                    <p>Track and manage your restaraunt's inventory</p>
                </div>
                <Link href="/dashboard/inventory/add">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inventory.filter((item) => item.quantity <= 5).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inventory.filter((item) => new Date(item.expiryDate) >= new Date()).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {inventory.filter((item) => {
                                const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                return daysUntilExpiry <= 0;
                            }).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search inventory..."
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
                    <Table >
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead>Expiry Status</TableHead>
                                <TableHead>Stock Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.itemName}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell className="text-right">
                                        {item.quantity} {item.unit}
                                    </TableCell>
                                    <TableCell className="text-right">${item.purchasePrice.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(
                                                Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                            )}
                                            {(() => {
                                                const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                                return daysUntilExpiry <= 3 && daysUntilExpiry > 0 ? (
                                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                ) : null;
                                            })()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStockBadge(item.quantity, 5)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            <Trash className="h-2 w-2" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

