"use client"

import React from 'react'
import {motion} from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const Cta = () => {
    return (
        <section className="py-20">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-lg bg-primary text-primary-foreground p-8 md:p-12 shadow-lg"
          >
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Kitchen?</h2>
                <p className="text-primary-foreground/90 md:text-xl">
                  Join hundreds of kitchens already saving money and reducing waste with our AI system.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <Button size="lg" variant="secondary" className="gap-1.5">
                  Book a Demo <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
}

export default Cta