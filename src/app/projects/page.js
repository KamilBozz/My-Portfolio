import ProjectSearchFilter from "@/components/project-search-filter"

export default async function AllProjects() {
    const projects = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`)
    .then(res => res.json())
    .then(data => data.projects)
    .catch(error => {
        console.error("Error fetching projects:", error);
        return [];
    })
    return (
        <ProjectSearchFilter projects={projects} />
    )
}