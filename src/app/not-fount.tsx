"use client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-[400px] text-center">
                <CardHeader>
                    <CardTitle className="text-5xl font-bold">404</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-lg">Oops! Page not found.</p>
                    <Button className="mt-6 w-full" onClick={() => redirect("/")}>
                        Go to Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFound;
