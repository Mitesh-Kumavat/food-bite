"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { month: "Jan", waste: 65, prediction: 70 },
  { month: "Feb", waste: 59, prediction: 63 },
  { month: "Mar", waste: 52, prediction: 55 },
  { month: "Apr", waste: 45, prediction: 48 },
  { month: "May", waste: 40, prediction: 42 },
  { month: "Jun", waste: 37, prediction: 39 },
  { month: "Jul", waste: 35, prediction: 36 },
  { month: "Aug", waste: 32, prediction: 33 },
  { month: "Sep", waste: 30, prediction: 31 },
  { month: "Oct", waste: 28, prediction: 29 },
  { month: "Nov", waste: 25, prediction: 26 },
  { month: "Dec", waste: 22, prediction: 23 },
]

export default function WasteReductionChart() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Waste Reduction Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis label={{ value: "Waste (kg)", angle: -90, position: "insideLeft" }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="waste" stroke="#6366f1" fillOpacity={1} fill="url(#colorWaste)" />
          <Area type="monotone" dataKey="prediction" stroke="#94a3b8" fillOpacity={1} fill="url(#colorPrediction)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white shadow-md rounded-md">
        <div className="font-medium">{label}</div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
          <span>Actual: {payload[0]?.value} kg</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
          <span>Predicted: {payload[1]?.value} kg</span>
        </div>
      </div>
    )
  }
  return null
}
