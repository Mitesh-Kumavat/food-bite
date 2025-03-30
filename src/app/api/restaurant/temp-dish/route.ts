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
  expiryDate: Date;
}

// ✅ **Step 1: Filter Ingredients Expiring Tomorrow (Date Comparison Fixed)**
function getIngredientsExpiringTomorrow(
  inventory: InventoryItem[]
): InventoryItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inventory.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);

    // ✅ Check if the date difference is exactly 1 day
    const timeDiff = expiryDate.getTime() - today.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return dayDiff === 1;
  });
}

// ✅ **Step 2: Call Gemini API and Get Dish Suggestions as Text**
async function generateDishSuggestions(
  ingredientNames: string[]
): Promise<string | null> {
  const GEMINI_API_KEY = "AIzaSyCbK4lK3XmEPIaGRKo0xTLpRjpG4wED6AE"; // 🔥 Replace with your Gemini 2.0 API Key
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  // ✅ Refined prompt for text-based output
  const prompt = `You are a highly skilled chef specializing in creating unique and creative dishes using available ingredients that are about to expire.

🔹 **Task:**
Generate multiple dish suggestions using some or all of these ingredients that will expire soon. It is NOT necessary to use all the ingredients, but the dish should make sense.

🔹 **Output Format:**
Return the result in plain text format, where each dish follows this pattern:
dishName: Description; dishName: Description;

🔹 **Requirements:**
- Return a string containing at least 5 unique and diverse dish suggestions.
- Do NOT include any extra text, markdown, or JSON code blocks.
- Each dish should be separated by a semicolon (;) and should follow the exact pattern.

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
              text: prompt,
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

  // ✅ Extract the text-based response
  const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!textResponse) {
    console.error("Invalid response from Gemini API.");
    return null;
  }

  console.log("Generated Text Response:", textResponse);
  return textResponse;
}

// ✅ **Step 3: Parse Text Response into JSON**
function parseDishSuggestions(responseText: string): { dishName: string; description: string }[] {
  const dishesArray = responseText.split(";").map((item) => item.trim());

  const parsedDishes = dishesArray
    .filter((dish) => dish.includes(":"))
    .map((dish) => {
      const [dishName, description] = dish.split(":").map((part) => part.trim());
      return { dishName, description };
    });

  return parsedDishes;
}

// ✅ **Step 4: Check if Dishes Already Exist in the Menu**
async function dishExistsInMenu(generatedDish: string): Promise<boolean> {
  const menu = [
    { name: "chole bhature" },
    { name: "pulao" },
  ]; // Replace with actual DB call if needed

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
    const mappedInventory: InventoryItem[] = inventory.map((item: any) => ({
      unit: item.unit,
      itemName: item.itemName,
      quantity: item.quantity,
      expiryDate: item.expiryDate,
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

    // ✅ Generate dish suggestions using expiring ingredients
    const ingredientNames = expiringIngredients.map((item) => item.itemName);
    const responseText = await generateDishSuggestions(ingredientNames);

    if (!responseText) {
      return NextResponse.json(
        { error: "Failed to generate dish suggestions." },
        { status: 500 }
      );
    }

    // ✅ Parse generated text into JSON format
    const generatedDishes = parseDishSuggestions(responseText);
    if (generatedDishes.length === 0) {
      return NextResponse.json(
        { error: "No valid dish suggestions generated." },
        { status: 500 }
      );
    }

    // ✅ Filter out existing dishes from the generated ones
    const newDishes = [];
    for (const dish of generatedDishes) {
      const dishExists = await dishExistsInMenu(dish.dishName);
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
