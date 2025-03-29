"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await axios.post("/api/login", formData)
            localStorage.setItem("userId", response.data.data._id);
            console.log("Login successful:", response.data.data)
            if (response.status !== 200) {
                setError("Login failed")
                toast("Login failed")
                return;
            }
            toast("Login successful")
            router.push("/dashboard")
        } catch (error: any) {
            setError(error.response.data.message)
            toast.error(`Login failed : ${error.response.data.message}`)
            console.error("Login failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 px-4">
            <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 font-bold text-xl">
                {/* your platform logo */}
                <MessageSquare className="h-6 w-6" />
                <span>Your Platform Name</span>
            </Link>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your email and password to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2 mb-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="********"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-6">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

