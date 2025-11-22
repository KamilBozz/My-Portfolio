import ProjectCard from "@/components/project-card"

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
                <ProjectCard key={project.title} project={project} />
            ))}
        </div>
    )
}