import { deleteProject, getProjectById, updateProject } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";
import { z } from "zod";

const projectUpdateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().min(2).max(200).optional(),
  img: z.string().url().optional(),
  link: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
});

export async function DELETE(request, { params }) {
    try {
        const { uuid } = await params;
        
        if (!uuid) {
            return Response.json({ error: "Project ID is required" }, { status: 400 });
        }
        
        const response = await deleteProject(uuid);
        
        if(!response) {
            return Response.json({ error: "Project not found" }, { status: 404 });
        }
        
        return Response.json({ success: true, project: response });
    } catch (error) {
        console.error("Error deleting project:", error);
        return Response.json({ error: "Failed to delete project" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { uuid } = await params;
        const project = await getProjectById(uuid);
        
        if(!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

export const PUT = auth0.withApiAuthRequired(async (request, { params }) => {
    try {
        const { uuid } = await params;
        
        if (!uuid) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }
        
        const session = await auth0.getSession(request);
        
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const body = await request.json();
        const validatedData = projectUpdateSchema.parse(body);
        
        const updatedProject = await updateProject(uuid, validatedData);
        
        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, project: updatedProject });
    } catch (error) {
        console.error("Error updating project:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation error", errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
});