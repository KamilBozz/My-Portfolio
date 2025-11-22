import { getProjects } from "@/lib/db";
import { notFound } from "next/navigation";
import EditProjectForm from "@/components/edit-project-form";
import { createSlug } from "@/lib/utils";

export default async function EditProjectPage({ params }) {
    const { slug } = await params;
    
    const projects = await getProjects();
    const project = projects.find(p => createSlug(p.title) === slug);
    
    if (!project) {
        notFound();
    }
    
    return (
        <div className="flex justify-center items-center min-h-screen py-8">
            <div className="w-full max-w-2xl px-4">
                <EditProjectForm project={project} uuid={project.id} />
            </div>
        </div>
    );
}

