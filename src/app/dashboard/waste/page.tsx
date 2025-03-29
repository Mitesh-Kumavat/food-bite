"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, Trash2, AlertTriangle } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { mockInventoryData, mockWasteData } from "@/lib/mock-data"
import { toast } from "sonner"
import { WasteByReasonChart } from "@/components/dashboard/waste-by-reason-chart"
import { WasteTrendChart } from "@/components/dashboard/waste-trend-chart"

export default function WastePage() {
  const [waste, setWaste] = useState(mockWasteData)
  const [inventory, setInventory] = useState(mockInventoryData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // New waste form state
  const [newWaste, setNewWaste] = useState({
    itemId: "",
    quantity: "1",
    reason: "",
    notes: "",
  })

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setWaste(mockWasteData)
      setInventory(mockInventoryData)
      setIsLoading(false)
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
    setNewWaste((prev) => ({ ...prev, itemId: value }))
  }

  const handleReasonChange = (value: string) => {
    setNewWaste((prev) => ({ ...prev, reason: value }))
  }

  const addWaste = async () => {
    if (!newWaste.itemId || !newWaste.quantity || !newWaste.reason) {
      toast("Error",{
        description: "Please fill in all required fields",
      })
      return
    }

    try {
      // Find the selected inventory item
      const item = inventory.find((item) => item.id === newWaste.itemId)

      if (!item) {
        throw new Error("Inventory item not found")
      }

      // Create a new waste record
      const wasteRecord = {
        id: `waste-${Date.now()}`,
        date: selectedDate,
        itemId: item.id,
        itemName: item.name,
        quantity: Number.parseFloat(newWaste.quantity),
        unit: item.unit,
        reason: newWaste.reason,
        cost: item.unitPrice * Number.parseFloat(newWaste.quantity),
        notes: newWaste.notes,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update waste state
      setWaste((prev) => [wasteRecord, ...prev])

      // Reset form
      setNewWaste({
        itemId: "",
        quantity: "1",
        reason: "",
        notes: "",
      })

      toast("Waste recorded",{
        description: `${wasteRecord.quantity} ${wasteRecord.unit} of ${wasteRecord.itemName} recorded as waste.`,
      })
    } catch (error) {
      toast("Error",{
        description: "Failed to record waste. Please try again.",
      })
    }
  }

  const deleteWaste = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update waste state
      setWaste((prev) => prev.filter((item) => item.id !== id))

      toast("Waste record deleted",{
        description: "The waste record has been removed.",
      })
    } catch (error) {
      toast("Error",{
        description: "Failed to delete waste record. Please try again.",
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
            <h2 className="text-2xl font-semibold">Waste Management</h2>
            <p>Track and analyze food waste to optimize inventory</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Cost</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWasteCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {totalWasteItems} waste records</p>
          </CardContent>
        </Card>
      </div>

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
              <Select value={newWaste.itemId} onValueChange={handleItemChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select inventory item" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.quantity} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                name="quantity"
                type="number"
                min="0.01"
                step="0.01"
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
              name="notes"
              placeholder="Additional notes about this waste..."
              value={newWaste.notes}
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
        <CardContent className="p-5 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWaste.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell className="text-right">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteWaste(item.id)}>
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

