import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { createSlug } from "@/lib/utils"

  

export default async function AllProjects() {
    const projects = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`)
    .then(res => res.json())
    .then(data => data.projects)
    .catch(error => {
        console.error("Error fetching projects:", error);
        return [];
    })
    return (
        <div className="flex flex-wrap justify-center gap-6 px-4 py-8">
            {projects.map((project) => (
                <Card key={project.title} className="w-full sm:w-80 max-w-sm flex flex-col">
                    <div className="relative w-full h-48 overflow-hidden">
                        {project.img? 
                            <Image 
                                src={project.img} 
                                alt={project.title} 
                                fill
                                sizes="(max-width: 640px) 100vw, 320px"
                                className="object-cover"
                            />
                            : <Skeleton className="w-full h-full" />
                        }
                    </div>
                    <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{project.desc}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href={`/projects/${createSlug(project.title)}`}>
                            <Button variant="outline">View Project</Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}