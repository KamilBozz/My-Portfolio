import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return(
        <div className="flex justify-center items-center min-h-screen">
            <Card>
                <h1>Resource Requested Was Not Found</h1>
                <Button variant="outline">
                    <Link href="/">Go to Home</Link>
                </Button>
            </Card>
        </div>
    )
}