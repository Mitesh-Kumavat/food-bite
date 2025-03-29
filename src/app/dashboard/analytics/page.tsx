"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesAnalyticsChart } from "@/components/dashboard/sales-analytics-chart"
import { InventoryValueChart } from "@/components/dashboard/inventory-value-chart"
import { WasteAnalyticsChart } from "@/components/dashboard/waste-analytics-chart"
import { TopSellingItemsChart } from "@/components/dashboard/top-selling-items-chart"
import { ProfitMarginChart } from "@/components/dashboard/profit-margin-chart"
import { mockAnalyticsData } from "@/lib/mock-data"

export default function AnalyticsPage() {
    const [data, setData] = useState(mockAnalyticsData)
    const [timeRange, setTimeRange] = useState("30days")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            setIsLoading(true)
            // In a real app, this would be an API call with the timeRange parameter
            await new Promise((resolve) => setTimeout(resolve, 500))
            setData(mockAnalyticsData)
            setIsLoading(false)
        }

        fetchData()
    }, [timeRange])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold">Analytics</h2>
                    <p>Detailed insights and reports on your restaurant's performance</p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="year">Last year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="sales" className="space-y-4">
                <TabsList className="grid grid-cols-4 md:w-[600px]">
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="waste">Waste</TabsTrigger>
                    <TabsTrigger value="profit">Profit</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${data.sales.totalRevenue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.sales.revenueChange > 0 ? "+" : ""}
                                    {data.sales.revenueChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${data.sales.averageOrderValue.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.sales.aovChange > 0 ? "+" : ""}
                                    {data.sales.aovChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.sales.totalOrders}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.sales.ordersChange > 0 ? "+" : ""}
                                    {data.sales.ordersChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.sales.itemsSold}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.sales.itemsSoldChange > 0 ? "+" : ""}
                                    {data.sales.itemsSoldChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1 md:col-span-2">
                            <CardHeader>
                                <CardTitle>Sales Trend</CardTitle>
                                <CardDescription>Daily revenue for the selected period</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <SalesAnalyticsChart data={data.sales.dailyRevenue} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Items</CardTitle>
                                <CardDescription>Most popular menu items by quantity sold</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <TopSellingItemsChart data={data.sales.topSellingItems} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales by Category</CardTitle>
                                <CardDescription>Revenue breakdown by menu category</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-muted-foreground">Category breakdown chart will appear here</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Current Inventory Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${data.inventory.currentValue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.inventory.valueChange > 0 ? "+" : ""}
                                    {data.inventory.valueChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.inventory.lowStockItems}</div>
                                <p className="text-xs text-muted-foreground">Items below minimum stock level</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.inventory.expiringSoon}</div>
                                <p className="text-xs text-muted-foreground">Items expiring within 7 days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.inventory.turnoverRate.toFixed(1)}x</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.inventory.turnoverChange > 0 ? "+" : ""}
                                    {data.inventory.turnoverChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory Value Trend</CardTitle>
                            <CardDescription>Daily inventory value for the selected period</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <InventoryValueChart data={data.inventory.valueHistory} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="waste" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Waste Cost</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${data.waste.totalCost.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.waste.costChange > 0 ? "+" : ""}
                                    {data.waste.costChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Waste as % of Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.waste.percentOfRevenue.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.waste.percentChange > 0 ? "+" : ""}
                                    {data.waste.percentChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Most Wasted Item</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.waste.mostWastedItem}</div>
                                <p className="text-xs text-muted-foreground">${data.waste.mostWastedCost.toFixed(2)} in waste</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Primary Waste Reason</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.waste.primaryReason}</div>
                                <p className="text-xs text-muted-foreground">{data.waste.primaryReasonPercent}% of total waste</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Waste Trend</CardTitle>
                            <CardDescription>Daily waste cost for the selected period</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <WasteAnalyticsChart data={data.waste.dailyCost} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profit" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${data.profit.totalProfit.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.profit.profitChange > 0 ? "+" : ""}
                                    {data.profit.profitChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.profit.profitMargin.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.profit.marginChange > 0 ? "+" : ""}
                                    {data.profit.marginChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Food Cost %</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.profit.foodCostPercent.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.profit.foodCostChange > 0 ? "+" : ""}
                                    {data.profit.foodCostChange}% from previous period
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Most Profitable Item</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.profit.mostProfitableItem}</div>
                                <p className="text-xs text-muted-foreground">{data.profit.mostProfitableItem} is the most profitable item</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profit Margin Trend</CardTitle>
                            <CardDescription>Daily profit margin for the selected period</CardDescription>
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

