"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WasteTrendChartProps {
  data: {
    date: Date | string
    cost: number
    [key: string]: any
  }[]
}

export function WasteTrendChart({ data }: WasteTrendChartProps) {
  // Process data to get the last 7 days
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    })
    .reverse()

  // Group waste by date
  const wasteByDate = data.reduce(
    (acc, item) => {
      const date = new Date(item.date).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += item.cost
      return acc
    },
    {} as Record<string, number>,
  )

  // Create chart data with all 7 days
  const chartData = last7Days.map((date) => ({
    date,
    cost: wasteByDate[date] || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs text-muted-foreground"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => `$${value}`}
          className="text-xs text-muted-foreground"
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                      <span className="font-bold text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Cost</span>
                      <span className="font-bold">₹${payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line type="bump" dataKey="cost" stroke="red" strokeWidth={2} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

