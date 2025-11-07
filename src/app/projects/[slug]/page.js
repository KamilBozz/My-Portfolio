import { createSlug } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default async function ProjectDetailPage({ params }) {
    const { slug } = await params
    const projects = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`)
    .then(res => res.json())
    .then(data => data.projects)
    .catch(error => {
        console.error("Error fetching project:", error);
        return null;
    })

    const project = projects.find(project => createSlug(project.title) === slug)

    return(
        <div className="flex justify-center items-center min-h-screen py-8">
            <div className="w-full max-w-2xl px-4">
                <div className="flex flex-col justify-center items-center gap-6">
                    <h1 className="text-4xl font-bold text-center">{project.title}</h1>
                    <Image src={project.img} alt={project.title} width={300} height={300} />
                    <div className="text-center">{project.desc}</div>
                    <Button variant="outline">
                        <Link href={project.link}>View Project</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
