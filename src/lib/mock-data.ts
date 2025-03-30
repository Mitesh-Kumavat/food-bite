// Dashboard mock data
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
    {
        id: "inv-002",
        name: "Chicken Breast",
        category: "meat",
        quantity: 15,
        unit: "kg",
        unitPrice: 8.5,
        daysUntilExpiry: 3,
        minStock: 8,
        supplier: "Quality Meats Co.",
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
    {
        id: "menu-002",
        name: "Spaghetti Carbonara",
        category: "pastas",
        price: 14.99,
        active: true,
        ingredients: [
            { id: "inv-017", name: "Pasta", quantity: 0.15, unit: "kg" },
            { id: "inv-011", name: "Eggs", quantity: 0.17, unit: "dozen" },
            { id: "inv-014", name: "Parmesan Cheese", quantity: 0.05, unit: "kg" },
            { id: "inv-008", name: "Pancetta", quantity: 0.08, unit: "kg" },
            { id: "inv-020", name: "Black Pepper", quantity: 0.005, unit: "kg" },
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
        id: "waste-001",
        date: new Date(),
        itemId: "inv-001",
        itemName: "Tomatoes",
        quantity: 0.5,
        unit: "kg",
        reason: "spoiled",
        cost: 1.5,
        notes: "Found spoiled in storage",
    },
    {
        id: "waste-002",
        date: new Date(),
        itemId: "inv-006",
        itemName: "Lettuce",
        quantity: 0.3,
        unit: "kg",
        reason: "spoiled",
        cost: 0.6,
        notes: "Wilted and unusable",
    },
    {
        id: "waste-003",
        date: new Date(),
        itemId: "inv-003",
        itemName: "Milk",
        quantity: 0.5,
        unit: "l",
        reason: "expired",
        cost: 1.0,
        notes: "Past expiration date",
    },
    {
        id: "waste-004",
        date: new Date(Date.now() - 86400000), // Yesterday
        itemId: "inv-002",
        itemName: "Chicken Breast",
        quantity: 0.2,
        unit: "kg",
        reason: "preparation",
        cost: 1.7,
        notes: "Trimming waste",
    },
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
    {
        id: "waste-006",
        date: new Date(Date.now() - 86400000 * 3), // 3 days ago
        itemId: "inv-007",
        itemName: "Mozzarella Cheese",
        quantity: 0.1,
        unit: "kg",
        reason: "expired",
        cost: 1.0,
        notes: "Moldy",
    },
    {
        id: "waste-007",
        date: new Date(Date.now() - 86400000 * 4), // 4 days ago
        itemId: "inv-001",
        itemName: "Tomatoes",
        quantity: 0.3,
        unit: "kg",
        reason: "spoiled",
        cost: 0.9,
        notes: "Overripe",
    },
]

// Analytics mock data
export const mockAnalyticsData = {
    sales: {
        totalRevenue: 45231.89,
        revenueChange: 20.1,
        averageOrderValue: 32.75,
        aovChange: 5.2,
        totalOrders: 1380,
        ordersChange: 15.3,
        itemsSold: 4250,
        itemsSoldChange: 18.7,
        dailyRevenue: [
            { date: "Jan 1", revenue: 1200 },
            { date: "Jan 2", revenue: 1400 },
            { date: "Jan 3", revenue: 1300 },
            { date: "Jan 4", revenue: 1800 },
            { date: "Jan 5", revenue: 2000 },
            { date: "Jan 6", revenue: 2200 },
            { date: "Jan 7", revenue: 1900 },
            { date: "Jan 8", revenue: 1700 },
            { date: "Jan 9", revenue: 1600 },
            { date: "Jan 10", revenue: 1500 },
            { date: "Jan 11", revenue: 1800 },
            { date: "Jan 12", revenue: 2100 },
            { date: "Jan 13", revenue: 1700 },
            { date: "Jan 14", revenue: 1900 },
            { date: "Jan 15", revenue: 2000 },
            { date: "Jan 16", revenue: 2200 },
            { date: "Jan 17", revenue: 2400 },
            { date: "Jan 18", revenue: 2300 },
            { date: "Jan 19", revenue: 2100 },
            { date: "Jan 20", revenue: 2000 },
            { date: "Jan 21", revenue: 2200 },
            { date: "Jan 22", revenue: 2400 },
            { date: "Jan 23", revenue: 2600 },
            { date: "Jan 24", revenue: 2500 },
            { date: "Jan 25", revenue: 2300 },
            { date: "Jan 26", revenue: 2200 },
            { date: "Jan 27", revenue: 2400 },
            { date: "Jan 28", revenue: 2600 },
            { date: "Jan 29", revenue: 2800 },
            { date: "Jan 30", revenue: 2700 }
        ],
        topSellingItems: [
            { name: "Margherita Pizza", quantity: 450 },
            { name: "Spaghetti Carbonara", quantity: 380 },
            { name: "Chicken Parmesan", quantity: 320 },
            { name: "Caesar Salad", quantity: 280 },
            { name: "Tiramisu", quantity: 250 }
        ]
    },
    inventory: {
        currentValue: 12500,
        valueChange: 5.3,
        lowStockItems: 3,
        expiringSoon: 5,
        turnoverRate: 4.2,
        turnoverChange: 0.5,
        valueHistory: [
            { date: "Jan 1", value: 11500 },
            { date: "Jan 5", value: 12000 },
            { date: "Jan 10", value: 11800 },
            { date: "Jan 15", value: 12200 },
            { date: "Jan 20", value: 12100 },
            { date: "Jan 25", value: 12300 },
            { date: "Jan 30", value: 12500 }
        ]
    },
    waste: {
        totalCost: 1250.75,
        costChange: -8.3,
        percentOfRevenue: 2.8,
        percentChange: -1.2,
        mostWastedItem: "Lettuce",
        mostWastedCost: 180.50,
        primaryReason: "Spoilage",
        primaryReasonPercent: 45,
        dailyCost: [
            { date: "Jan 1", cost: 45 },
            { date: "Jan 5", cost: 38 },
            { date: "Jan 10", cost: 42 },
            { date: "Jan 15", cost: 35 },
            { date: "Jan 20", cost: 40 },
            { date: "Jan 25", cost: 32 },
            { date: "Jan 30", cost: 30 }
        ]
    },
    profit: {
        totalProfit: 15750.25,
        profitChange: 12.5,
        profitMargin: 34.8,
        marginChange: 2.3,
        foodCostPercent: 28.5,
        foodCostChange: -1.8,
        mostProfitableItem: "Margherita Pizza",
    }
}


interface Sale {
    _id: string, //
    restaurant: string,
    dishes: [
        {
            dish: {
                _id: string, //dish._id
                name: string, //
                price: number, //dish.price
            },
            quantity: number,
            _id: string
        }
    ],
    totalSales: number, //
    saleDate: string, //
}
