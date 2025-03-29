import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecentSalesProps {
    data: {
        id: string
        customer: string
        email: string
        amount: number
        date: string
    }[]
}

export function RecentSales({ data }: RecentSalesProps) {
    return (
        <div className="space-y-8">
            {data.map((sale) => (
                <div key={sale.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {sale.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.customer}</p>
                        <p className="text-sm text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className="ml-auto font-medium">+${sale.amount.toFixed(2)}</div>
                </div>
            ))}
        </div>
    )
}

