"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Utensils, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { InventoryStatusChart } from "@/components/dashboard/inventory-status-chart"
import { mockDashboardData } from "@/lib/mock-data"

export default function HomePage() {

    const [data, setData] = useState(mockDashboardData)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            setIsLoading(true)
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 500))
            setData(mockDashboardData)
            setIsLoading(false)
        }

        fetchData()
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {data.revenueChange > 0 ? "+" : ""}
                                {data.revenueChange}% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${data.inventoryValue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{data.inventoryItems} items in stock</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menu Items Sold</CardTitle>
                            <Utensils className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.menuItemsSold}</div>
                            <p className="text-xs text-muted-foreground">
                                {data.menuItemsSoldChange > 0 ? "+" : ""}
                                {data.menuItemsSoldChange}% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
                            {data.profitLoss > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${data.profitLoss > 0 ? "text-green-500" : "text-red-500"}`}>
                                {data.profitLoss > 0 ? "+" : ""}
                                {data.profitLoss}%
                            </div>
                            <p className="text-xs text-muted-foreground">Compared to last month</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-8">
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                            <CardDescription>Daily sales for the current month</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <SalesChart data={data.salesData} />
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Inventory Status</CardTitle>
                            <CardDescription>Current inventory by category</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <InventoryStatusChart data={data.inventoryStatus} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Alerts</CardTitle>
                            <CardDescription>Items requiring attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.alerts.map((alert, i) => (
                                    <div key={i} className="flex items-start gap-4 rounded-md border p-4">
                                        <AlertTriangle
                                            className={`mt-0.5 h-5 w-5 ${alert.type === "warning" ? "text-amber-500" : "text-red-500"}`}
                                        />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{alert.title}</p>
                                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
