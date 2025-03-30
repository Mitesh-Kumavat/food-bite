"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Utensils, TrendingUp, } from "lucide-react"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { InventoryStatusChart } from "@/components/dashboard/inventory-status-chart"
import { toast } from "sonner"
import axios from "axios"
import DashboardSkeleton from "@/components/dashboard/skeleton"


interface InventoryStatus {
    name: string;
    value: number;
    color: string;
}

interface SalesData {
    date: string;
    revenue: number;
}

interface DashboardData {
    inventoryItems: number;
    inventoryStatus: InventoryStatus[];
    inventoryValue: number;
    menuItemsSold: number;
    profitLoss: number;
    salesData: SalesData[];
    totalRevenue: number;
}

export default function HomePage() {

    const [data, setData] = useState<DashboardData | any>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem("token");
                const data = await axios.get("/api/restaurant/dashboard", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                })
                setData(data.data)
            } catch (error) {
                console.log(error, "error");
                toast.error("Failed to fetch data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>

            {isLoading && <DashboardSkeleton />}

            {!isLoading && (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    from today's sell
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{data.inventoryValue.toLocaleString()}</div>
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
                                    from today's sell
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${data.profitLoss > 0 ? "text-green-500" : "text-red-500"}`}>
                                    ₹{data.profitLoss}
                                </div>
                                <p className="text-xs text-muted-foreground">from today's sell</p>
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
                                <SalesChart data={data?.salesData} />
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
                                <InventoryStatusChart data={data ? data.inventoryStatus : []} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Alerts</CardTitle>
                                <CardDescription>Items requiring attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* generate dummy data here */}
                                    {/* {data.alerts.map((alert, i) => (
                                        <div key={i} className="flex items-start gap-4 rounded-md border p-4">
                                            <AlertTriangle
                                                className={`mt-0.5 h-5 w-5 ${alert.type === "warning" ? "text-amber-500" : "text-red-500"}`}
                                            />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">{alert.title}</p>
                                                <p className="text-sm text-muted-foreground">{alert.description}</p>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
