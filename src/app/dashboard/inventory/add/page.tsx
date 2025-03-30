"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"

export default function AddInventoryPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [expiryDate, setExpiryDate] = useState<Date>(new Date())

    const [formData, setFormData] = useState({
        itemName: "",
        category: "",
        quantity: "",
        unit: "kg",
        expiryDate: 0,
        purchasePrice: "",
        supplier: "",
        minStockLevel: "",
        notes: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("token");
            console.log(token);

            const data = await axios.post("/api/restaurant/inventory", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            toast("Inventory item added successfully", {
                description: `${formData.itemName} has been added to inventory.`,
            })

            router.push("/dashboard/inventory")
        } catch (error) {
            console.log(error);
            toast("Error adding inventory item", {
                description: "Failed to add inventory item. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold">Add Inventory Item</h2>
                    <p className="text-muted-foreground">Add a new item to your inventory</p>
                </div>
                <Link href="/dashboard/inventory">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Inventory
                    </Button>
                </Link>
            </div>

            <Card className="border-primary/10">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="mb-5 border-b pb-6">
                        <CardTitle>Item Details</CardTitle>
                        <CardDescription>
                            Enter the details of the new inventory item
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="itemName">Item Name</Label>
                                <Input
                                    id="itemName"
                                    name="itemName"
                                    placeholder="e.g., Fresh Tomatoes"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    required
                                    className="border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleSelectChange("category", value)}
                                    required
                                >
                                    <SelectTrigger id="category" className="border-primary/20 focus-visible:ring-primary/30">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="produce">Produce</SelectItem>
                                        <SelectItem value="meat">Meat</SelectItem>
                                        <SelectItem value="dairy">Dairy</SelectItem>
                                        <SelectItem value="grains">Grains</SelectItem>
                                        <SelectItem value="spices">Spices</SelectItem>
                                        <SelectItem value="beverages">Beverages</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 10"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    className="border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expires after how many days</Label>
                                <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="expiryDate"
                                    min='0'
                                    placeholder="e.g.1, 5, 10"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    required
                                    className="border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(value) => handleSelectChange("unit", value)}
                                    required
                                >
                                    <SelectTrigger id="unit" className="border-primary/20 focus-visible:ring-primary/30">
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                        <SelectItem value="g">Grams (g)</SelectItem>
                                        <SelectItem value="l">Liters (L)</SelectItem>
                                        <SelectItem value="ml">Milliliters (ml)</SelectItem>
                                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                                        <SelectItem value="box">Box</SelectItem>
                                        <SelectItem value="bottle">Bottle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice">Purchase Price Per Unit (₹)</Label>
                                <Input
                                    id="purchasePrice"
                                    name="purchasePrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g., 299.99"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    required
                                    className="border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>
                        </div>
                        <div />
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.push("/dashboard/inventory")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {isSubmitting ? "Adding..." : "Add Item"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
