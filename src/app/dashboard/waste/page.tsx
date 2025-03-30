"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, AlertTriangle } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { WasteByReasonChart } from "@/components/dashboard/waste-by-reason-chart"
import { WasteTrendChart } from "@/components/dashboard/waste-trend-chart"
import axios from "axios"
import DashboardSkeleton from "@/components/dashboard/skeleton"

interface WasteRecord {
  _id: string,
  date: string,
  itemId: string,
  itemName: string,
  quantity: number,
  unit: string,
  reason: string,
  cost: number,
  description: string,
  inventoryItem: InventoryItem[] | null
}

interface InventoryItem {
  _id: string,
  itemName: string,
  category: string,
  quantity: number,
  unit: string,
  purchasePrice: number,
  expiryDate: string,
}

export default function WastePage() {
  const [waste, setWaste] = useState<WasteRecord[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [newWaste, setNewWaste] = useState({
    inventoryItemId: "",
    quantity: "1",
    reason: "",
    description: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await axios.get("/api/restaurant/waste", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const inventoryData = await axios.get("/api/restaurant/inventory", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setWaste(data.data)
        setInventory(inventoryData.data)
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredWaste = waste.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleNewWasteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewWaste((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (value: string) => {
    setNewWaste((prev) => ({ ...prev, inventoryItemId: value }))
  }

  const handleReasonChange = (value: string) => {
    setNewWaste((prev) => ({ ...prev, reason: value }))
  }

  const addWaste = async () => {
    if (!newWaste.inventoryItemId || !newWaste.quantity || !newWaste.reason) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      })
      return
    }

    try {
      const item = inventory?.find((item) => item._id === newWaste.inventoryItemId)
      if (!item) {
        throw new Error("Inventory item not found")
      }

      const data = await axios.post("/api/restaurant/waste", {
        inventoryItemId: item._id,
        quantity: Number.parseFloat(newWaste.quantity),
        reason: newWaste.reason,
        description: newWaste.description,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      if (data.status !== 200) {
        throw new Error("Failed to record waste")
      }
      const wasteRecord = {
        _id: `waste-${Date.now()}`,
        date: Date.now(),
        indexedDBtemId: item._id,
        itemName: item.itemName,
        quantity: Number.parseFloat(newWaste.quantity),
        unit: item.unit,
        reason: newWaste.reason,
        cost: Number(newWaste.quantity) * item.purchasePrice,
        purchasePrice: item.purchasePrice * Number.parseFloat(newWaste.quantity),
        description: newWaste.description,
        inventoryItem: null,
      }

      setWaste((prev: any) => [wasteRecord, ...prev])

      setNewWaste({
        inventoryItemId: "",
        quantity: "1",
        reason: "",
        description: "",
      })

      toast.success("Waste recorded", {
        description: `${wasteRecord.quantity} ${wasteRecord.unit} of ${wasteRecord.itemName} recorded as waste.`,
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to record waste. Please try again.",
      })
    }
  }

  const totalWasteCost = filteredWaste.reduce((sum, item) => sum + item.cost, 0)
  const totalWasteItems = filteredWaste.length

  // Group waste by reason for the chart
  const wasteByReason = waste.reduce(
    (acc, item) => {
      if (!acc[item.reason]) {
        acc[item.reason] = 0
      }
      acc[item.reason] += item.cost
      return acc
    },
    {} as Record<string, number>,
  )

  const wasteByReasonData = Object.entries(wasteByReason).map(([name, value]) => ({
    name,
    value: Number.parseFloat(value.toFixed(2)),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Waste Management</h2>
          <p className="text-sm">Track and analyze food waste to optimize inventory</p>
        </div>
      </div>

      {isLoading && <DashboardSkeleton />}

      {!isLoading && (<>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Waste Cost</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalWasteCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From {totalWasteItems} waste records</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search waste records..."
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
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {filteredWaste.map((item) => (
                  <TableRow key={item._id} >
                    <TableCell className="py-4">{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium py-4">{item.itemName}</TableCell>
                    <TableCell className="py-4">
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="py-4">{item.reason}</TableCell>
                    <TableCell className="py-4">₹{item.cost.toFixed(2)}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Record Waste</CardTitle>
            <CardDescription>Document wasted items to track and reduce waste</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <DatePicker
                  date={selectedDate}
                  setDate={(date) => setSelectedDate(date || new Date())}
                />
              </div>
              <div>
                <Select name="inventoryItemId" value={newWaste.inventoryItemId} onValueChange={handleItemChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inventory item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory?.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.itemName}({item.quantity} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={newWaste.quantity}
                  onChange={handleNewWasteChange}
                />
              </div>
              <div>
                <Select value={newWaste.reason} onValueChange={handleReasonChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="spoiled">Spoiled</SelectItem>
                    <SelectItem value="overproduction">Overproduction</SelectItem>
                    <SelectItem value="preparation">Preparation Waste</SelectItem>
                    <SelectItem value="customer-return">Customer Return</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Textarea
                name="description"
                placeholder="Additional notes about this waste..."
                value={newWaste.description}
                onChange={handleNewWasteChange}
                className="min-h-[80px]"
              />
            </div>
            <div className="mt-4">
              <Button onClick={addWaste}>
                <Plus className="mr-2 h-4 w-4" />
                Record Waste
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Waste by Reason</CardTitle>
              <CardDescription>Cost breakdown by waste reason</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <WasteByReasonChart data={wasteByReasonData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Waste Trend</CardTitle>
              <CardDescription>Daily waste cost for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <WasteTrendChart data={waste} />
            </CardContent>
          </Card>
        </div>
      </>)}
    </div>
  )
}

