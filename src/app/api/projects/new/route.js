import { insertProject } from "@/lib/db";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

const projectSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  img: z.string().url({ message: "Image URL is required" }),
  link: z.string().url({ message: "Link is required" }),
  keywords: z.array(z.string()).optional(),
})

export const POST = auth0.withApiAuthRequired(async (request) => {
  try {
    const session = await auth0.getSession(request);
    
    if (!session?.user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const img = formData.get("img");
    const link = formData.get("link");
    const keywords = formData.getAll("keywords");
 
    const payload = projectSchema.parse({
      title: title ?? "",
      description: description ?? "",
      img: img ?? "",
      link: link ?? "",
      keywords: keywords ?? [],
    });
    
    const project = await insertProject({...payload});
    
    if(!project) {
      return NextResponse.json({ ok: false, message: "There was an error creating the project" }, { status: 500 });
    }
    
    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: "Validation error", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: "There was an error creating the project" }, { status: 500 });
  }
});