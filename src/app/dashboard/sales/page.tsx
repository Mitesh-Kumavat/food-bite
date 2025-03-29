"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, Calendar, Trash2 } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockMenuData, mockSalesData } from "@/lib/mock-data"
import { toast } from "sonner"

export default function SalesPage() {
    const [sales, setSales] = useState(mockSalesData)
    const [menuItems, setMenuItems] = useState(mockMenuData)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(true)

    // New sale form state
    const [newSale, setNewSale] = useState({
        menuItemId: "",
        quantity: "1",
    })

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            setIsLoading(true)
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            setSales(mockSalesData)
            setMenuItems(mockMenuData)
            setIsLoading(false)
        }

        fetchData()
    }, [])

    const filteredSales = sales.filter((sale) => sale.itemName.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleNewSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewSale((prev) => ({ ...prev, [name]: value }))
    }

    const handleMenuItemChange = (value: string) => {
        setNewSale((prev) => ({ ...prev, menuItemId: value }))
    }

    const addSale = async () => {
        if (!newSale.menuItemId || !newSale.quantity) {
            toast("Error", {
                description: "Please select a menu item and quantity",
            })
            return
        }

        try {
            // Find the selected menu item
            const menuItem = menuItems.find((item) => item.id === newSale.menuItemId)

            if (!menuItem) {
                throw new Error("Menu item not found")
            }

            // Create a new sale
            const sale = {
                id: `sale-${Date.now()}`,
                date: selectedDate,
                itemId: menuItem.id,
                itemName: menuItem.name,
                quantity: Number.parseInt(newSale.quantity),
                unitPrice: menuItem.price,
                total: menuItem.price * Number.parseInt(newSale.quantity),
            }

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Update sales state
            setSales((prev) => [sale, ...prev])

            // Reset form
            setNewSale({
                menuItemId: "",
                quantity: "1",
            })

            toast("Sale recorded", {
                description: `${sale.quantity} x ${sale.itemName} added to sales.`,
            })
        } catch (error) {
            toast("Error", {
                description: "Failed to record sale. Please try again.",
            })
        }
    }

    const deleteSale = async (id: string) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Update sales state
            setSales((prev) => prev.filter((sale) => sale.id !== id))

            toast("Sale deleted", {
                description: "The sale has been removed from the records.",
            })
        } catch (error) {
            toast("Error", {
                description: "Failed to delete sale. Please try again.",
            })
        }
    }

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">Daily Sales</h2>
                <p>Record and track your daily sales</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">For {selectedDate.toLocaleDateString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems}</div>
                        <p className="text-xs text-muted-foreground">Across {filteredSales.length} transactions</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Record New Sale</CardTitle>
                    <CardDescription>Add sales to update inventory and track revenue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-3">
                            <DatePicker date={selectedDate} setDate={(date) => setSelectedDate(date || new Date())} />
                        </div>
                        <div className="md:col-span-4">
                            <Select value={newSale.menuItemId} onValueChange={handleMenuItemChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select menu item" />
                                </SelectTrigger>
                                <SelectContent>
                                    {menuItems.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name} (${item.price.toFixed(2)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Input
                                name="quantity"
                                type="number"
                                min="1"
                                placeholder="Qty"
                                value={newSale.quantity}
                                onChange={handleNewSaleChange}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Button onClick={addSale} className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Sale
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search sales..."
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
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell>
                                        {new Date(sale.date).toLocaleDateString()}{" "}
                                        {new Date(sale.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </TableCell>
                                    <TableCell className="font-medium">{sale.itemName}</TableCell>
                                    <TableCell className="text-right">{sale.quantity}</TableCell>
                                    <TableCell className="text-right">${sale.unitPrice.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => deleteSale(sale.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                            <span className="sr-only">Delete</span>
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

