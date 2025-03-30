"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChefHat } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function SignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        restaurantName: "",
        restaurantAddress: "",
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
            const response = await axios.post("/api/signup", formData)
            if (response.status === 400) {
                setError("Signup failed")
                toast("Signup failed")
                return;
            }
            toast("Signup successful")
            router.push("/login")
        } catch (error: any) {
            setError(error.response.data.message)
            toast.error(`Signup failed : ${error.response.data.message}`)
            console.error("Signup failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 px-4">
            <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 font-bold text-xl">
                {/* Your Platform logo */}
                <ChefHat className="h-6 w-6" />
                <span>Foodbit</span>
            </Link>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Signup</CardTitle>
                    <CardDescription>Enter your details to create your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 w-full">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    placeholder="johndoe"
                                    required
                                    value={formData.userName}
                                    onChange={handleChange}
                                />
                            </div>
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
                        </div>
                        <div className="space-y-2 ">
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
                        <div className="space-y-2 ">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="restaurantName">Restaurant Name</Label>
                            </div>
                            <Input
                                id="restaurantName"
                                name="restaurantName"
                                type="text"
                                placeholder="Your Restaurant Name"
                                required
                                value={formData.restaurantName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2 mb-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="restaurantAddress ">Restaurant Address</Label>
                            </div>
                            <Input
                                id="restaurantAddress"
                                name="restaurantAddress"
                                type="text"
                                placeholder="Your Restaurant Address"
                                required
                                value={formData.restaurantAddress}
                                onChange={handleChange}
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-6">
                        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Signin up..." : "Signup"}
                        </Button>
                        <div className="text-center text-sm">
                            already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

