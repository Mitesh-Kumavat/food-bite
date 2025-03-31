import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { verifyAuth } from "@/lib/auth";
import Inventory from "@/models/inventory .model";
import Dish from "@/models/dish.model";
import Restaurant from "@/models/restaurant.model";

interface InventoryItem {
  unit: string;
  itemName: string;
  quantity: number;
  expiryDate: string | Date;
}

interface MenuItem {
  name: string;
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

async function generateDishSuggestions(
  ingredientNames: string[],
  currentMenu: MenuItem[]
): Promise<string | null> {
  const GEMINI_API_KEY = "AIzaSyCbK4lK3XmEPIaGRKo0xTLpRjpG4wED6AE";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const currentMenuNames = currentMenu.map((item) => item.name).join(", ");

  const prompt = `You are a highly skilled chef specializing in creating unique and creative dishes using available ingredients that are about to expire.

🔹 **Task:**
Generate multiple dish suggestions using some or all of these ingredients that will expire soon. It is NOT necessary to use all the ingredients, but the dish should make sense.

🔹 **Output Format:**
Return the result in plain text format, where each dish follows this pattern:
dishName: Description: ingredient: quantity : unit; dishName: Description: ingredient: quantity : unit;
Units can be grams, kg, liters,ml, pieces, boxes, and bottle only no other than that so give the unit from the given only. The quantity should be a number. The description should be  giving information about the dish.

🔹 **Requirements:**
- Return a string containing at least 5 unique and diverse dish suggestions.
- Do NOT include any of the following dishes that are already on the menu: ${currentMenuNames}.
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

// ✅ **Step 3: Parse Text Response into JSON with Ingredients**
function parseDishSuggestions(responseText: string): {
  dishName: string;
  description: string;
  ingredients: InventoryItem[];
}[] {
  const dishesArray = responseText.split(";").map((item) => item.trim());

  const parsedDishes = dishesArray
    .filter((dish) => dish.includes(":"))
    .map((dish) => {
      const parts = dish.split(":").map((part) => part.trim());
      const dishName = parts[0];
      const description = parts[1];

      // ✅ Extract ingredients if available
      const ingredients = [];
      for (let i = 2; i < parts.length; i += 3) {
        if (parts[i] && parts[i + 1] && parts[i + 2]) {
          ingredients.push({
            itemName: parts[i],
            quantity: parseInt(parts[i + 1], 10),
            unit: parts[i + 2],
            expiryDate: new Date().toISOString(), // Use current date for demo
          });
        }
      }

      return { dishName, description, ingredients };
    });

  return parsedDishes;
}

// ✅ **Step 4: Check if Dishes Already Exist in the Menu**
async function dishExistsInMenu(
  generatedDish: string,
  currentMenu: MenuItem[]
): Promise<boolean> {
  return currentMenu.some(
    (dish) => dish.name.toLowerCase() === generatedDish.toLowerCase()
  );
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

    // ✅ Fetch current menu from DB
    const currentMenu = await Dish.find({ restaurant: restaurant._id }).select(
      "name"
    );
    console.log(`Current Menu for Restaurant ID: ${restaurant._id}`, currentMenu);

    // ✅ Fetch inventory data
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

    // ✅ Generate dish suggestions using expiring ingredients and current menu
    const ingredientNames = expiringIngredients.map((item) => item.itemName);
    const responseText = await generateDishSuggestions(
      ingredientNames,
      currentMenu
    );

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

    // ✅ Filter out empty ingredient dishes
    const filteredDishes = generatedDishes.filter(
      (dish) => dish.ingredients.length > 0
    );

    // ✅ Filter out existing dishes from the generated ones
    const newDishes = [];
    for (const dish of filteredDishes) {
      const dishExists = await dishExistsInMenu(dish.dishName, currentMenu);
      if (!dishExists) {
        newDishes.push(dish);
      }
    }

    // ✅ Return newly generated dish suggestions
    if (newDishes.length === 0) {
      return NextResponse.json(
        {
          message:
            "All suggested dishes already exist in the menu or have no valid ingredients.",
        },
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);

    const { dishes } = await req.json(); // ✅ Expecting an array of dishes

    if (!Array.isArray(dishes) || dishes.length === 0) {
      return NextResponse.json(
        { error: "Invalid data format. Expected an array of dishes." },
        { status: 400 }
      );
    }

    // Check if the restaurant exists for the logged-in user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const dishIds = [];

    // ✅ Loop through each dish and create in the database
    for (const dish of dishes) {
      const {
        name,
        ingredients,
        price,
        category,
        prepTime,
        allergens,
        description,
        isEphemeral,
      } = dish;

      let newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 1);

      // Create each dish
      const menuItem = await Dish.create({
        restaurant: restaurant._id,
        name,
        ingredients,
        price,
        activeOnMenu: true, // Default to active when added manually
        category,
        prepTime,
        allergens,
        description,
        isEphemeral,
        ephemeralExpiresAt: isEphemeral ? newExpiry : null,
      });

      dishIds.push(menuItem._id); // ✅ Collect newly added dish IDs
    }

    // ✅ Update the restaurant's menu array with new dishes
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $push: { menu: { $each: dishIds } },
    });

    return NextResponse.json(
      {
        message: `${dishes.length} dishes added successfully.`,
        dishIds,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add multiple dishes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
