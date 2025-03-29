"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  popular = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={popular ? "lg:-mt-8" : ""}
    >
      <Card className={`h-full flex flex-col ${popular ? "border-primary shadow-lg" : ""}`}>
        <CardHeader>
          {popular && (
            <Badge className="w-fit mb-2" variant="default">
              Most Popular
            </Badge>
          )}
          <CardTitle>{title}</CardTitle>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{price}</span>
            {price !== "Custom" && <span className="text-muted-foreground">/month</span>}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant={popular ? "default" : "outline"}>
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

