"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, Calendar, Trash2 } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { toast } from "sonner"
import DashboardSkeleton from "@/components/dashboard/skeleton"

// **Types**
interface Dish {
    _id: string
    name: string
    price: number
}

interface Sale {
    _id: string
    saleDate: string
    totalSales: number
    dishes: {
        dish: Dish
        quantity: number
    }[]
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([])
    const [menuItems, setMenuItems] = useState<Dish[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [newSale, setNewSale] = useState({
        menuItemId: "",
        quantity: "1",
    })

    useEffect(() => {
        fetchSalesData()
        fetchMenuItems()
    }, [])

    const fetchSalesData = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            const response = await axios.get<Sale[]>("/api/restaurant/sales", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            setSales(response.data)
        } catch (error) {
            toast.error("Failed to fetch sales data", {
                description: "Please try again later.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchMenuItems = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            const response = await axios.get<Dish[]>("/api/restaurant/menu", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            setMenuItems(response.data)
        } catch (error) {
            toast.error("Failed to fetch menu items", {
                description: "Please try again later.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewSale((prev) => ({ ...prev, [name]: value }))
    }

    const handleMenuItemChange = (value: string) => {
        setNewSale((prev) => ({ ...prev, menuItemId: value }))
    }

    const addSale = async () => {
        if (!newSale.menuItemId || !newSale.quantity) {
            toast.error("Error", {
                description: "Please select a menu item and quantity",
            })
            return
        }
        if (Number(newSale.quantity) <= 0) {
            toast.error("Error", {
                description: "Quantity must be greater than 0",
            })
            return
        }

        const addData = {
            dishes: [{
                dishId: newSale.menuItemId,
                quantity: Number(newSale.quantity),
            }]
        }

        try {
            const menuItem = menuItems.find((item) => item._id === newSale.menuItemId)
            if (!menuItem) throw new Error("Menu item not found")
            const token = localStorage.getItem("token")
            await axios.post("/api/restaurant/sales", addData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const newSaleEntry: Sale = {
                _id: `sale-${Date.now()}`,
                saleDate: selectedDate.toISOString(),
                totalSales: menuItem.price * Number(newSale.quantity),
                dishes: [{ dish: menuItem, quantity: Number(newSale.quantity) }],
            }

            setSales((prev) => [newSaleEntry, ...prev])

            setNewSale({ menuItemId: "", quantity: "1" })

            toast.success("Sale recorded", {
                description: `${newSaleEntry.dishes[0].quantity} x ${menuItem.name} added.`,
            })
        } catch (error) {
            toast.error("Error", {
                description: "Failed to record sale. Please try again.",
            })
        }
    }

    const deleteSale = async (id: string) => {
        try {
            setSales((prev) => prev.filter((sale) => sale._id !== id))
            toast.success("Sale deleted", {
                description: "The sale has been removed from the records.",
            })
        } catch (error) {
            toast.error("Error", {
                description: "Failed to delete sale. Please try again.",
            })
        }
    }

    const filteredSales = sales.filter((sale) =>
        sale.dishes.some((dish) => dish.dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalSales, 0)
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.dishes.reduce((dSum, d) => dSum + d.quantity, 0), 0)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold">Daily Sales</h2>
                    <p className="text-sm">Record and track your daily sales</p>
                </div>
            </div>

            {isLoading && <DashboardSkeleton />}

            {!isLoading && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader >
                                <div className="flex justify-between">
                                    <CardTitle>Total Sales</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Items Sold</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalItems}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Record New Sale</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-8">
                                    <Select value={newSale.menuItemId} onValueChange={handleMenuItemChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select menu item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {menuItems.map((item) => (
                                                <SelectItem key={item._id} value={item._id}>
                                                    {item.name} (₹ {item.price.toFixed(2)})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Input name="quantity" type="number" min="1" value={newSale.quantity} onChange={handleNewSaleChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <Button onClick={addSale}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Sale
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSales.map((sale) => (
                                        <TableRow key={sale._id}>
                                            <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{sale.dishes[0].dish.name}</TableCell>
                                            <TableCell>{sale.dishes[0].quantity}</TableCell>
                                            <TableCell>₹ {sale.totalSales.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => deleteSale(sale._id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
