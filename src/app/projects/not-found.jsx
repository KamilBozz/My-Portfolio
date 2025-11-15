"use client";

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function NotFound() {
    const {slug} = useParams()
    return(
        <div className="flex justify-center items-center min-h-screen">
            <Card>
                <h1>The project <b>"{slug}"</b> does not exist</h1>
                <Button variant="outline">
                    <Link href="/">Home</Link>
                </Button>
            </Card>
        </div>
    )
}