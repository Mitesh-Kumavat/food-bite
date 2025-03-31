"use client"

import { XAxis, YAxis, Line, ResponsiveContainer, CartesianGrid, Tooltip, LineChart } from "recharts"

interface SalesChartProps {
    data: {
        date: string
        amount: number
    }[]
}

export function SalesChart({ data }: SalesChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} >
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
                    tickFormatter={(value) => `₹${value}`}
                    className="text-xs text-muted-foreground"
                />
                <Tooltip
                    formatter={(value: number, name: string, props: any) => [`₹${value}`, "Sales"]}
                    labelFormatter={(label: string) => `Date: ${label}`}
                />
                <Line type="monotone" dataKey="amount" stroke="#00C951" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

