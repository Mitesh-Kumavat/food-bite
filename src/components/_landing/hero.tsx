"use client"

import React from 'react'
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <Badge className="mb-2" variant="outline">
                AI-Powered Kitchen Management
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Reduce Kitchen Waste with Smart AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our AI system tracks inventory, predicts waste, and optimizes your menu to save money and reduce
                environmental impact.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-1.5">
                Get Started <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
            <div className="relative h-auto w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src="/images/dashboard.png"
                width={1900}
                height={1500}
                alt="Smart Kitchen Dashboard"
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero