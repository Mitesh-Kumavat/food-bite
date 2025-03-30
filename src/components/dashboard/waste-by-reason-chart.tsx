"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface WasteByReasonChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function WasteByReasonChart({ data }: WasteByReasonChartProps) {
  const COLORS = [
    "#F97316",
    "#EF4444",
    "#3B82F6",
    "#EC4899",
    "#8B5CF6",
    "#EAB308",
    "#D946EF",
  ]


  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Reason</span>
                      <span className="font-bold text-muted-foreground">{payload[0].name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Cost</span>
                      <span className="font-bold">₹{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

