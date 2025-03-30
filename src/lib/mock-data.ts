export const mockDashboardData = {
    totalRevenue: 45231.89,
    inventoryValue: 12500,
    inventoryItems: 156,
    menuItemsSold: 2350,
    profitLoss: 18.5,
    salesData: [
        { date: "Jan 1", amount: 1200 },
        { date: "Jan 2", amount: 1400 },
        { date: "Jan 3", amount: 1300 },
        { date: "Jan 4", amount: 1800 },
        { date: "Jan 5", amount: 2000 },
        { date: "Jan 6", amount: 2200 },
        { date: "Jan 7", amount: 1900 },
        { date: "Jan 8", amount: 1700 },
        { date: "Jan 9", amount: 1600 },
        { date: "Jan 10", amount: 1500 },
        { date: "Jan 11", amount: 1800 },
        { date: "Jan 12", amount: 2100 },
        { date: "Jan 13", amount: 1700 },
        { date: "Jan 14", amount: 1900 },
    ],
    inventoryStatus: [
        { name: "Produce", value: 3500, color: "#4CAF50" },
        { name: "Meat", value: 4200, color: "#F44336" },
        { name: "Dairy", value: 2100, color: "#2196F3" },
        { name: "Grains", value: 1800, color: "#FF9800" },
        { name: "Beverages", value: 900, color: "#9C27B0" },
    ],
    alerts: [
        {
            type: "warning",
            title: "Low Stock Alert",
            description: "Tomatoes are running low (2kg remaining)",
        },
        {
            type: "critical",
            title: "Expiring Soon",
            description: "Fresh milk expires in 2 days",
        },
        {
            type: "warning",
            title: "Waste Alert",
            description: "High waste detected for lettuce (15% of stock)",
        },
    ],
}

// Inventory mock data
export const mockInventoryData = [
    {
        id: "inv-001",
        name: "Tomatoes",
        category: "produce",
        quantity: 10,
        unit: "kg",
        unitPrice: 2.99,
        daysUntilExpiry: 5,
        minStock: 5,
        supplier: "Fresh Farms Inc.",
    },
]

// Menu mock data
export const mockMenuData = [
    {
        id: "menu-001",
        name: "Margherita Pizza",
        category: "pizzas",
        price: 12.99,
        active: true,
        ingredients: [
            { id: "inv-001", name: "Tomatoes", quantity: 0.3, unit: "kg" },
            { id: "inv-007", name: "Mozzarella Cheese", quantity: 0.2, unit: "kg" },
            { id: "inv-009", name: "Basil", quantity: 0.02, unit: "kg" },
            { id: "inv-017", name: "Pizza Dough", quantity: 0.25, unit: "kg" },
            { id: "inv-005", name: "Olive Oil", quantity: 0.02, unit: "l" },
        ],
    },
]

// Sales mock data
export const mockSalesData = [
    {
        id: "sale-001",
        date: new Date(),
        itemId: "menu-001",
        itemName: "Margherita Pizza",
        quantity: 2,
        unitPrice: 12.99,
        total: 25.98,
    },
]

// Waste mock data
export const mockWasteData = [
    {
        id: "waste-005",
        date: new Date(Date.now() - 86400000 * 2), // 2 days ago
        itemId: "inv-015",
        itemName: "Salmon Fillet",
        quantity: 0.15,
        unit: "kg",
        reason: "preparation",
        cost: 3.45,
        notes: "Skin and trimmings",
    },
]
