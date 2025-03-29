'use client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Footer = () => {

    const [currentYear, setCurrentYear] = useState<number>(0)
    useEffect(() => {
        setCurrentYear(new Date().getFullYear())
    }, [])

    return (
        <footer className="w-full mx-auto container border-t bg-background py-6 md:py-12">
            <div className="container px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <MessageSquare className="h-6 w-6" />
                            <span>PostPlatform</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Share your thoughts with the world. Create, discover, and engage with content that matters to you.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Platform</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {currentYear} Your Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer