"use client"

import { Badge } from 'lucide-react'
import React from 'react'
import StatCard from '../landing_components/stat-card'
import {motion} from 'framer-motion';
import WasteReductionChart from '../landing_components/waste-reduction-chart';

const AiInsightsSection = () => {
  return (
    <div>
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Data-Driven Kitchen Management
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI provides valuable insights to help you make informed decisions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Waste Reduction"
              value="42%"
              description="Average waste reduction for our customers"
              trend="up"
            />
            <StatCard
              title="Cost Savings"
              value="$12,500"
              description="Average annual savings per kitchen"
              trend="up"
            />
            <StatCard
              title="Carbon Footprint"
              value="3.2 tons"
              description="Average CO₂ reduction per year"
              trend="down"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-4">Waste Reduction Over Time</h3>
            <div className="h-[350px]">
              <WasteReductionChart />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AiInsightsSection
