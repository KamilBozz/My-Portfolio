export async function POST(req) {
    try {
      const formData = await req.formData();
      const title = formData.get("title");
      const description = formData.get("description");
      const img = formData.get("img");
      const link = formData.get("link");
      const keywords = formData.get("keywords");

      console.log("Received project data:", {title, description, img, link, keywords})
  
      // FUTURE CONCERNS - you can ignore them now
      // TODO: (recommended) validate here again with Zod
      // TODO: persist to DB (Prisma/Drizzle/etc.)
      // TODO: revalidatePath("/projects") after write (if using Next cache)
  
  
      return Response.json({ ok: true, project: { title, description, img, link, keywords } }, { status: 201 });
    } catch (err) {
      console.error(err);
      return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
  }
  