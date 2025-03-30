import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { verifyAuth } from "@/lib/auth";
import Inventory from "@/models/inventory .model";
import mongoose from "mongoose";
import Dish from "@/models/dish.model";
import Restaurant from "@/models/restaurant.model";

interface InventoryItem {
    unit: string;
    itemName: string;
    quantity: number;
    expiryDate: Date; // ✅ Use Date here, not string
}

// ✅ **Step 1: Filter Ingredients Expiring Tomorrow (Date Comparison Fixed)**
function getIngredientsExpiringTomorrow(inventory: InventoryItem[]): InventoryItem[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00 for date-only comparison

    return inventory.filter((item) => {
        const expiryDate = new Date(item.expiryDate); // ✅ Correct date handling
        expiryDate.setHours(0, 0, 0, 0); // Ignore time for comparison

        // ✅ Check if the date difference is exactly 1 day
        const timeDiff = expiryDate.getTime() - today.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days

        // ✅ Debugging to check date difference
        console.log(
            `Checking: ${item.itemName} | Expiry Date: ${expiryDate.toDateString()} | Days Diff: ${dayDiff}`
        );

        return dayDiff === 1; // Only return items expiring tomorrow
    });
}

// ✅ **Step 2: Call Gemini API for Recipe Suggestions**
async function generateDishSuggestions(ingredientNames: string[]): Promise<string[] | null> {
    const GEMINI_API_KEY = "AIzaSyCbK4lK3XmEPIaGRKo0xTLpRjpG4wED6AE"; // ✅ Replace with your Gemini 2.0 API Key
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    // ✅ Generate dish prompt with all possible combinations
    const prompt = `You are a highly skilled chef specializing in creating unique and creative dishes using available ingredients that are about to expire.

🔹 **Task:**
Generate multiple dish suggestions using some or all of these ingredients that will expire soon. It is NOT necessary to use all the ingredients, but the dish should make sense.

🔹 **Output Format:**
Return ONLY valid JSON data in the following format:
[
  {
    "dishName": "Chole Bhature",
    "description": "A deep-fried Indian bread served with spicy chickpea curry."
  },
  {
    "dishName": "Paneer Tikka",
    "description": "Grilled paneer cubes marinated in aromatic spices, served with mint chutney."
  }
]

🔹 **Requirements:**
- Return a JSON array of dish objects.
- Each dish should include:
  - dishName: Name of the dish.
  - description: A brief but detailed description of the dish.
- Generate at least 5 unique and diverse dish suggestions.
- Do NOT include any extra text, markdown, or code blocks.
- Ensure the JSON array contains properly formatted dish objects.

Ingredients available: ${ingredientNames.join(", ")}
`;




    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt, // ✅ Correctly formatted payload
                        },
                    ],
                },
            ],
        }),
    });

    if (!response.ok) {
        console.error("Error calling Gemini API:", await response.text());
        return null;
    }

    const data = await response.json();
    console.log("AI Response:", data);

    // ✅ Extract generated content from response
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!textResponse) {
        console.error("Invalid response from Gemini API.");
        return null;
    }

    // ✅ Clean response before parsing
    const cleanResponse = textResponse.replace(/^```json\n/, "").replace(/\n```$/, ""); // ✅ Remove code block markers

    // ✅ Parse JSON response from Gemini API
    try {
        const generatedDishes = JSON.parse(cleanResponse);
        return generatedDishes.map((dish: any) => dish.name); // Return dish names
    } catch (error) {
        console.error("Error parsing Gemini API response:", error);
        return null;
    }
}

// ✅ **Step 3: Check if Dishes Already Exist in the Menu**
async function dishExistsInMenu(generatedDish: string): Promise<boolean> {
    const menu = [
        { name: "chole bhature" },
        { name: "pulao" },
    ]; // Replace with actual DB call

    return menu.some((dish) => dish.name.toLowerCase() === generatedDish.toLowerCase());
}

// ✅ **Route to Generate Temporary Dishes**
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await verifyAuth(req);
        const restaurant = await Restaurant.findOne({ owner: payload._id });
        if (!restaurant) {
            return NextResponse.json(
                { error: "Restaurant not found" },
                { status: 404 }
            );
        }

        const inventory = await Inventory.find({ restaurant: restaurant._id });
        // ✅ Convert inventory to InventoryItem[]
        const mappedInventory: InventoryItem[] = inventory.map((item: any) => ({
            unit: item.unit,
            itemName: item.itemName,
            quantity: item.quantity,
            expiryDate: item.expiryDate, // ✅ Correct Date Handling
        }));

        console.log(`Inventory for Restaurant ID: ${payload._id}`, mappedInventory);

        // ✅ Get all ingredients that will expire tomorrow
        const expiringIngredients = getIngredientsExpiringTomorrow(mappedInventory);
        if (expiringIngredients.length === 0) {
            return NextResponse.json(
                { message: "No ingredients are expiring tomorrow." },
                { status: 200 }
            );
        }

        // ✅ Generate dish suggestions using all expiring ingredients
        const ingredientNames = expiringIngredients.map((item) => item.itemName);
        const generatedDishes = await generateDishSuggestions(ingredientNames);

        if (!generatedDishes || generatedDishes.length === 0) {
            return NextResponse.json(
                { error: "Failed to generate dish suggestions." },
                { status: 500 }
            );
        }

        // ✅ Filter out existing dishes from the generated ones
        const newDishes = [];
        for (const dish of generatedDishes) {
            const dishExists = await dishExistsInMenu(dish);
            if (!dishExists) {
                newDishes.push(dish);
            }
        }

        // ✅ Return newly generated dish suggestions
        if (newDishes.length === 0) {
            return NextResponse.json(
                { message: "All suggested dishes already exist in the menu." },
                { status: 200 }
            );
        }

        return NextResponse.json({
            message: "New Temporary Dishes Generated",
            dishes: newDishes,
            ingredients: expiringIngredients,
        });
    } catch (error) {
        console.error("Error generating temp menu:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
