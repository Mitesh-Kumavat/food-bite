"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlusCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

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

const menuDishesData: MenuDish[] = [
    {
        name: "Chicken and Carrot Stir Fry with Maida Noodles",
        ingredients: [{ name: "chicken", quantity: 300, unit: "g" }],
        price: 230,
        category: "Main Course",
        prepTime: 35,
        allergens: ["None"],
        description: "Quick and easy stir fry of chicken and carrots served over homemade maida noodles",
        isEphemeral: true,
    },
]

export default function AiMenuSuggestionsPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<TempDish[]>([])
    const [ingredients, setIngredients] = useState<any[]>([])
    const [addingDish, setAddingDish] = useState<Record<string, boolean>>({})

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
            setSuggestions(response.data.dishes)
            console.log(response.data, "response data of ingredients");
        } catch (err) {
            console.error("Error fetching menu suggestions:", err)
            setError("Failed to load menu suggestions. Please try again.")

            setSuggestions([])
        } finally {
            setLoading(false)
        }
    }

    const addDishToMenu = async (dishName: string) => {
        setAddingDish((prev) => ({ ...prev, [dishName]: true }))

        try {
            // Find the matching dish data from our predefined data
            const dishToAdd = menuDishesData.find((dish) => dish.name === dishName)

            if (!dishToAdd) {
                throw new Error("Dish data not found")
            }

            // Get token from localStorage
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            // Make the API call to add the dish
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

            // Show success toast
            toast.success(`${dishName} added to menu`, {
                description: "This dish will be available on your menu for 1 day",
            })
        } catch (err) {
            console.error(`Error adding dish ${dishName} to menu:`, err)
            toast.error(`Failed to add ${dishName}`, {
                description: "Please try again or contact support if the issue persists",
            })
        } finally {
            setAddingDish((prev) => ({ ...prev, [dishName]: false }))
        }
    }

    const getCategoryBadgeColor = (dishName: string): string => {
        const dish = menuDishesData.find((d) => d.name === dishName)

        if (!dish) return "bg-secondary"

        switch (dish.category) {
            case "Main Course":
                return "bg-primary/80 hover:bg-primary/70"
            case "Snacks":
                return "bg-orange-500/80 hover:bg-orange-500/70"
            case "Soup":
                return "bg-blue-500/80 hover:bg-blue-500/70"
            case "Breakfast":
                return "bg-yellow-500/80 hover:bg-yellow-500/70"
            default:
                return "bg-secondary"
        }
    }

    const getPriceForDish = (dishName: string): number => {
        const dish = menuDishesData.find((d) => d.name === dishName)
        return dish?.price || 0
    }

    const getPrepTimeForDish = (dishName: string): number => {
        const dish = menuDishesData.find((d) => d.name === dishName)
        return dish?.prepTime || 0
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold">AI Menu Suggestions</h2>
                    <p className="text-muted-foreground">Smart dish recommendations based on your current inventory</p>
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
                    <span className="ml-2 text-lg">Loading suggestions...</span>
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
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{dish.dishName}</CardTitle>
                                    <Badge className={`${getCategoryBadgeColor(dish.dishName)} text-white`}>
                                        {menuDishesData.find((d) => d.name === dish.dishName)?.category || "Main Course"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <span className="font-medium text-primary">₹{getPriceForDish(dish.dishName)}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <span>{getPrepTimeForDish(dish.dishName)} min prep time</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{dish.description}</p>

                                <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {/* {dish.ingredients.map((ingredient, idx) => (
                                            <Badge key={idx} variant="outline" className="bg-primary/5">
                                                {ingredient.quantity} {ingredient.unit} {ingredient.itemName}
                                            </Badge>
                                        ))} */}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/20 pt-4">
                                <Button
                                    className="w-full"
                                    onClick={() => addDishToMenu(dish.dishName)}
                                    disabled={addingDish[dish.dishName]}
                                >
                                    {addingDish[dish.dishName] ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Add to Menu (1 day)
                                        </>
                                    )}
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
                        Check back later or update your inventory to get new suggestions.
                    </p>
                </div>
            )}
        </div>
    )
}

