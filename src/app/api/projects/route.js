// GET /api/projects
import { getProjects } from "@/lib/db";
export async function GET() {
    const projects = await getProjects();

    return Response.json({ projects });
  }
  