"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopSellingItemsChartProps {
  data: {
    name: string
    quantity: number
  }[]
}

export function TopSellingItemsChart({ data }: TopSellingItemsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs text-muted-foreground"
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs text-muted-foreground" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Item</span>
                      <span className="font-bold text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Quantity</span>
                      <span className="font-bold">{payload[0].value} sold</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="quantity" fill="#00C951" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

