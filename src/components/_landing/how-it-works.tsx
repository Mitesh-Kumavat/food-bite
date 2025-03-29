"use client"

import React from 'react'
import TimelineStep from '../landing_components/timeline-step'

function HowItWorks() {
  return (
    <div>
      <a id="how-it-works"></a>
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our simple four-step process to transform your kitchen operations.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <TimelineStep
                number={1}
                title="Connect"
                description="Connect our system to your inventory management and POS systems."
              />
              <TimelineStep
                number={2}
                title="Analyze"
                description="Our AI analyzes your data to identify patterns and opportunities."
              />
              <TimelineStep
                number={3}
                title="Optimize"
                description="Receive AI-powered recommendations for menu planning and inventory management."
              />
              <TimelineStep
                number={4}
                title="Save"
                description="Reduce waste, save money, and decrease your environmental impact."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks
