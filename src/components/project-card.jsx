"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import DeleteProjectButton from "@/components/delete-project-button"
import { createSlug } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectCard({ project }) {
    return (
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
                        <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex gap-2">
                        <Link href={`/projects/${createSlug(project.title)}`}>
                            <Button variant="outline">View Project</Button>
                        </Link>
                        <Link href={`/projects/${createSlug(project.title)}/edit`}>
                            <Button variant="outline">Edit</Button>
                        </Link>
                        <DeleteProjectButton id={project.id} />
                    </CardFooter>
                </Card>
            
    )
}