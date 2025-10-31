import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"


const projects = [
    {
      title: "Project One",
      desc: "Short blurb.",
      img: "https://placehold.co/300.png",
      link: "#"
      },
    {
        title: "Project Two",
        desc: "Short blurb.",
        img: "https://placehold.co/300.png",
        link: "#"
        },
        
    {
        title: "Project Three",
        desc: "Short blurb.",
        img: "https://placehold.co/300.png",
        link: "#"
        },  
  ];
  

export default function ProjectPreview({ count = 3 }) {
    return(
        <div className="flex justify-center gap-4 mt-4">
            <Skeleton/>
            {projects.slice(0, count).map((project) => (
                <Card key={project.title}>
                    <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Image src="/project.jpg" alt="project" width={300} height={300} />
                    </CardContent>
                    <CardFooter>
                        <Link href={project.link}>View Project</Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}