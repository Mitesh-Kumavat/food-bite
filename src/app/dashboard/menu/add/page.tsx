"use client"

import { TableCell } from "@/components/ui/table"
import { TableBody } from "@/components/ui/table"
import { TableHead } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"
import { TableHeader } from "@/components/ui/table"
import { Table } from "@/components/ui/table"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"

interface Ingredients {
    name: string,
    quantity: string,
    unit: string
}

export default function AddMenuItemPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [ingredients, setIngredients] = useState<Ingredients[]>([])
    const [newIngredient, setNewIngredient] = useState<Ingredients>(
        { name: "", quantity: "", unit: "g" }
    )

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        activeOnMenu: true,
        prepTime: "",
        allergens: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, active: checked }))
    }

    const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewIngredient((prev) => ({ ...prev, [name]: value }))
    }

    const handleIngredientUnitChange = (value: string) => {
        setNewIngredient((prev) => ({ ...prev, unit: value }))
    }

    const addIngredient = () => {
        if (newIngredient.name && newIngredient.quantity) {
            setIngredients((prev) => [...prev, { ...newIngredient }])
            setNewIngredient({ name: "", quantity: "", unit: "g" })
        }
    }

    const removeIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const data = await axios.post("/api/restaurant/menu", {
                ...formData,
                ...ingredients,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(data.data);

            toast("Menu item added", {
                description: `${formData.name} has been added to the menu.`,
            })

            router.push("/dashboard/menu")
        } catch (error) {
            toast.error("Error", {
                description: "Failed to add menu item. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold">Add Menu Item</h2>
                    <p>Add a new dish to your menu</p>
                </div>
                <Link href="/dashboard/menu">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Menu
                    </Button>
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader className="mb-5">
                        <CardTitle>Dish Details</CardTitle>
                        <CardDescription>Enter the details of the new menu item</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Dish Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g., Margherita Pizza"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleSelectChange("category", value)}
                                    required
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="appetizers">Appetizers</SelectItem>
                                        <SelectItem value="main-courses">Main Courses</SelectItem>
                                        <SelectItem value="pizzas">Pizzas</SelectItem>
                                        <SelectItem value="pastas">Pastas</SelectItem>
                                        <SelectItem value="salads">Salads</SelectItem>
                                        <SelectItem value="desserts">Desserts</SelectItem>
                                        <SelectItem value="beverages">Beverages</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g., 12.99"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prepTime">Preparation Time (minutes)</Label>
                                <Input
                                    id="prepTime"
                                    name="prepTime"
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 15"
                                    value={formData.prepTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="allergens">Allergens</Label>
                                <Input
                                    id="allergens"
                                    name="allergens"
                                    placeholder="e.g., Gluten, Dairy, Nuts"
                                    value={formData.allergens}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <Switch id="activeOnMenu" checked={formData.activeOnMenu} onCheckedChange={handleSwitchChange} />
                                <Label htmlFor="activeOnMenu">Active on Menu</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the dish..."
                                value={formData.description}
                                onChange={handleChange}
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Ingredients</Label>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                                <div className="md:col-span-5">
                                    <Input
                                        name="name"
                                        placeholder="Ingredient name"
                                        value={newIngredient.name}
                                        onChange={handleIngredientChange}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <Input
                                        name="quantity"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Quantity"
                                        value={newIngredient.quantity}
                                        onChange={handleIngredientChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Select value={newIngredient.unit} onValueChange={handleIngredientUnitChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="g">g</SelectItem>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="ml">ml</SelectItem>
                                            <SelectItem value="l">l</SelectItem>
                                            <SelectItem value="pcs">pcs</SelectItem>
                                            <SelectItem value="tbsp">tbsp</SelectItem>
                                            <SelectItem value="tsp">tsp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Button type="button" onClick={addIngredient} className="w-full">
                                        <Plus className="h-4 w-4" />
                                        <span className="sr-only">Add</span>
                                    </Button>
                                </div>
                            </div>

                            {ingredients.length > 0 && (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ingredient</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ingredients.map((ingredient, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{ingredient.name}</TableCell>
                                                    <TableCell>
                                                        {ingredient.quantity} {ingredient.unit}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                                                            <X className="h-4 w-4" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between mt-4">
                        <Button variant="outline" type="button" onClick={() => router.push("/dashboard/menu")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Dish"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

