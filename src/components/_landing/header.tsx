import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

const navLinks = [
    {
        title: "Features",
        href: "#features",
    },
    {
        title: "FAQ",
        href: "#faq",
    },
    {
        title: "About",
        href: "#",
    },
]

const Header = () => {
    return (
        <header className="mx-auto max-sm:px-2 container sticky top-0 z-40 md:px-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href={"/"} className="flex items-center gap-2 font-bold text-xl">
                    {/* your platform logo */}
                    <MessageSquare className="h-6 w-6" />
                    <span>Your Platform</span>
                </Link>
                <nav className="hidden md:flex gap-6">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary">
                            {link.title}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
                        Log in
                    </Link>
                    <Button asChild>
                        <Link href="signup">Sign up</Link>
                    </Button>
                </div>
            </div>
        </header>)
}

export default Header