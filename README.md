# FoodBite

FoodBite is a restaurant inventory management system designed to streamline inventory tracking, menu management, sales recording, and waste management. It provides insightful analytics through charts and graphs to help restaurants optimize their operations.

## Features

### 1. Inventory Management
- Add, delete, and search inventory items.
- Display total inventory count.
- Track low stock items.
- Identify items that are expiring soon or already expired.

### 2. Menu Items
- Add new dishes to the menu.
- Search for existing menu items.

### 3. Sales Tracking
- Record sales by selecting menu items.
- Display total sales revenue in rupees.
- Track the total number of items sold.

### 4. Waste Management
- Add waste records with details.
- Search for waste items.
- Calculate and display total waste cost.
- Visualize waste data with:
  - **Pie Chart**: Reasons for food waste.
  - **Line Graph**: Daily waste cost trends for the last 7 days (X-axis: Date, Y-axis: Cost).

### 5. AI-Powered Features
- **AI-Generated Menu Items**:
  - Identifies "expiring soon" inventory items.
  - Suggests and adds 8-10 menu items using these ingredients.
  - Automatically deletes menu items if they are not sold within 1-2 days.
- **Object Detection with OpenCV**:
  - Detects food items in images.
  - Model is trained to identify items but does not yet count them.
  - This feature is developed but not yet integrated into the main project.

## Technologies Used
- **Backend**: Next.js 
- **Database**: MongoDB
- **Frontend**: Next.js 
- **Visualization**: Recharts