import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"


import { Button } from "@/components/ui/button"

export default async function ProjectPreview({ count = 3 }) {

    const projects = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`)
    .then(res => res.json())
    .then(data => data.projects)
    .catch(error => {
        console.error("Error fetching projects:", error);
        return [];
    });

    return(
        <div className="flex justify-center gap-4 mt-4">
            <Skeleton/>
            {projects.slice(0, count).map((project) => (
                <Card key={project.title} className="w-full sm:w-80 max-w-sm flex flex-col">
                        <CardTitle>{project.title}</CardTitle>
                    <CardContent className="p-0">
                        {project.img? 
                            <Image src={project.img} alt={project.title} width={300} height={300} />
                            : <Skeleton className="w-full h-full" />
                        }
                    </CardContent>
                    <CardHeader className="pl-0">
                        <CardDescription className="line-clamp-3">{project.desc}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pl-0">
                        <Button variant="outline"><Link href={project.link}>View Project</Link></Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}