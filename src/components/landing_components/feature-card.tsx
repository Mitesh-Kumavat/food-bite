"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-primary">{icon}</div>
            <h3 className="font-semibold text-xl">{title}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}