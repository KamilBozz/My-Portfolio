import { createSlug } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { fetchProjects } from "@/lib/db"

export default async function ProjectDetailPage({ params }) {
    const { slug } = await params
    let projects = [];
    
    try {
        projects = await fetchProjects();
    } catch (error) {
        console.error("Error fetching projects:", error);
        projects = [];
    }

    const project = projects.find(project => createSlug(project.title) === slug)

    if(!project) {
        notFound()
    }

    return(
        <div className="flex justify-center items-center min-h-screen py-8">
            <div className="w-full max-w-2xl px-4">
                <div className="flex flex-col justify-center items-center gap-6">
                    <h1 className="text-4xl font-bold text-center">{project.title}</h1>
                    <Image src={project.img} alt={project.title} width={300} height={300} />
                    <div className="text-center">{project.description}</div>
                    <Button variant="outline">
                        <Link href={project.link}>View Project</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
