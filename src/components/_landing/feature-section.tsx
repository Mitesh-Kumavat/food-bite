"use client"

import React from 'react'
import { Badge } from '../ui/badge'
import FeatureCard from '../landing_components/feature-card'
import { BarChart3, Calendar, ChefHat, Utensils } from 'lucide-react'

const FeaturesSection = () => {
    return (
      <a id='features'>

        <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Smart Kitchen Management</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered system helps you manage your kitchen efficiently and reduce waste.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<ChefHat className="h-10 w-10" />}
              title="Inventory Tracking"
              description="Real-time tracking of all ingredients with expiration alerts and automatic reordering suggestions."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10" />}
              title="AI Waste Prediction"
              description="Predictive analytics to identify potential waste before it happens, saving you money and reducing environmental impact."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10" />}
              title="Smart Menu Optimization"
              description="AI-generated menu suggestions based on inventory to minimize waste and maximize ingredient usage."
            />
            <FeatureCard
              icon={<Utensils className="h-10 w-10" />}
              title="Detailed Reporting"
              description="Comprehensive reports on waste reduction, cost savings, and environmental impact metrics."
            />
          </div>
        </div>
      </section>
      </a>

    )
}

export default FeaturesSection