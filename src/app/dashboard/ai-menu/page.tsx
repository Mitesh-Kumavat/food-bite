"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlusCircle, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Ingredient {
    itemName: string
    quantity: number
    unit: string
    expiryDate: string
}

interface TempDish {
    dishName: string
    description: string
    ingredients: Ingredient[]
}

interface ApiResponse {
    message: string
    dishes: TempDish[]
    ingredients: {
        unit: string
        itemName: string
        quantity: number
        expiryDate: string
    }[]
}

interface MenuIngredient {
    name: string
    quantity: number
    unit: string
}

interface MenuDish {
    name: string
    ingredients: MenuIngredient[]
    price: number
    category: string
    prepTime: number
    allergens: string[]
    description: string
    isEphemeral: boolean
}

export default function AiMenuSuggestionsPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<TempDish[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedDish, setSelectedDish] = useState<TempDish | null>(null)
    const [newIngredient, setNewIngredient] = useState<{ name: string; quantity: string; unit: string }>({
        name: "",
        quantity: "",
        unit: "g",
    })

    // Form state for the modal
    const [formData, setFormData] = useState<Omit<MenuDish, "isEphemeral">>({
        name: "",
        ingredients: [],
        price: 0,
        category: "Main Course",
        prepTime: 30,
        allergens: ["None"],
        description: "",
    })

    useEffect(() => {
        fetchSuggestions()
    }, [])

    const fetchSuggestions = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            const response = await axios.get<ApiResponse>("/api/restaurant/temp-dish", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.data.message === "No ingredients are expiring tomorrow.") {
                setSuggestions([])
            } else {
                setSuggestions(response.data.dishes)
            }
        } catch (err) {
            console.error("Error fetching menu suggestions:", err)
            setError("Failed to load menu suggestions. Please try again.")
            setSuggestions([])
        } finally {
            setLoading(false)
        }
    }

    const openAddDishModal = (dish: TempDish) => {
        setSelectedDish(dish)

        // Convert the dish ingredients to the format expected by the form
        const ingredients: MenuIngredient[] = dish.ingredients.map((ing) => ({
            name: ing.itemName,
            quantity: ing.quantity,
            unit: ing.unit,
        }))

        // Initialize form data with the selected dish
        setFormData({
            name: dish.dishName,
            ingredients: ingredients,
            price: Math.floor(Math.random() * 150) + 100, // Random price between 100-250
            category: "Main Course", // Default category
            prepTime: Math.floor(Math.random() * 30) + 15, // Random prep time between 15-45 minutes
            allergens: ["None"],
            description: dish.description,
        })

        setModalOpen(true)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: Number(value) }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
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
            setFormData((prev) => ({
                ...prev,
                ingredients: [
                    ...prev.ingredients,
                    {
                        name: newIngredient.name,
                        quantity: Number(newIngredient.quantity),
                        unit: newIngredient.unit,
                    },
                ],
            }))
            setNewIngredient({ name: "", quantity: "", unit: "g" })
        }
    }

    const removeIngredient = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }))
    }

    const handleAllergensChange = (value: string) => {
        if (value === "None") {
            setFormData((prev) => ({ ...prev, allergens: ["None"] }))
        } else {
            setFormData((prev) => {
                // Remove "None" if it exists and add the new allergen
                const currentAllergens = prev.allergens.filter((a) => a !== "None")
                return {
                    ...prev,
                    allergens: [...currentAllergens, value],
                }
            })
        }
    }

    const addDishToMenu = async () => {
        if (
            !formData.name ||
            !formData.price ||
            !formData.category ||
            !formData.prepTime ||
            formData.ingredients.length === 0
        ) {
            toast.error("Please fill all required fields", {
                description: "Name, price, category, preparation time and at least one ingredient are required.",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            // Create the dish object with isEphemeral set to true
            const dishToAdd: MenuDish = {
                ...formData,
                isEphemeral: true,
            }

            // Make the API call with the correct payload structure
            await axios.post(
                "/api/restaurant/temp-dish",
                {
                    dishes: [dishToAdd],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            toast.success(`${formData.name} added to menu`, {
                description: "This dish will be available on your menu for 1 day",
            })

            // Close the modal after successful submission
            setModalOpen(false)
        } catch (err) {
            console.error(`Error adding dish to menu:`, err)
            toast.error(`Failed to add dish`, {
                description: "Please try again or contact support if the issue persists",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold">AI Menu Suggestions</h2>
                    <p className="text-sm">Smart dish recommendations based on your current inventory</p>
                </div>
                <Link href="/dashboard/menu">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Menu
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex h-[300px] w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">AI is generating the menu...</span>
                </div>
            ) : error ? (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                    <p className="text-lg font-medium text-destructive">{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchSuggestions}>
                        Try Again
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {suggestions.map((dish) => (
                        <Card key={dish.dishName} className="overflow-hidden border-primary/10 transition-all hover:shadow-md">
                            <CardHeader className="flex-1">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{dish.dishName}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    <span className="font-bold text-black dark:text-white">Description: </span>
                                    {dish.description}
                                </p>
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {dish.ingredients.map((ingredient, idx) => (
                                            <Badge key={idx} variant="outline" className="bg-primary/5">
                                                {ingredient.quantity} {ingredient.unit} {ingredient.itemName}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/20 pt-4">
                                <Button className="w-full" onClick={() => openAddDishModal(dish)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add to Menu
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && !error && suggestions.length === 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                    <p className="text-lg font-medium">No menu suggestions available at the moment.</p>
                    <p className="mt-2 text-muted-foreground">
                        No items are detected to be expiring soon. Check back later or update your inventory to get new suggestions.
                    </p>
                </div>
            )}

            {/* Add Dish Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Dish to Menu</DialogTitle>
                        <DialogDescription>Customize the dish details before adding it to your menu.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Dish Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Appetizers">Appetizers</SelectItem>
                                        <SelectItem value="Main Course">Main Course</SelectItem>
                                        <SelectItem value="Pizzas">Pizzas</SelectItem>
                                        <SelectItem value="Pastas">Pastas</SelectItem>
                                        <SelectItem value="Salads">Salads</SelectItem>
                                        <SelectItem value="Desserts">Desserts</SelectItem>
                                        <SelectItem value="Beverages">Beverages</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={formData.price}
                                    onChange={handleNumberInputChange}
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
                                    value={formData.prepTime}
                                    onChange={handleNumberInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="allergens">Allergens</Label>
                                <Select value={formData.allergens[0] || "None"} onValueChange={handleAllergensChange}>
                                    <SelectTrigger id="allergens">
                                        <SelectValue placeholder="Select allergens" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="None">None</SelectItem>
                                        <SelectItem value="Gluten">Gluten</SelectItem>
                                        <SelectItem value="Dairy">Dairy</SelectItem>
                                        <SelectItem value="Nuts">Nuts</SelectItem>
                                        <SelectItem value="Eggs">Eggs</SelectItem>
                                        <SelectItem value="Soy">Soy</SelectItem>
                                        <SelectItem value="Shellfish">Shellfish</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
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
                                            <SelectItem value="medium">medium</SelectItem>
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

                            {formData.ingredients.length > 0 && (
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
                                            {formData.ingredients.map((ingredient, index) => (
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
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={addDishToMenu} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add to Menu"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

