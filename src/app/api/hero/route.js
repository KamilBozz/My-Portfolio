import { NextResponse } from "next/server";
import { z } from "zod";
import { auth0 } from "@/lib/auth0";
import { getHero, upsertHero } from "@/lib/db";
import image2uri, { extTypeMap } from "image2uri";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

const heroSchema = z.object({
  avatar: z.string().trim().min(1).refine((v) => v.startsWith("data:"), "Avatar must be a data URL"),
  fullName: z.string().trim().min(2).max(200),
  shortDescription: z.string().trim().min(2).max(120),
  longDescription: z.string().trim().min(10).max(5000),
});

export async function GET() {
  try {
    const hero = await getHero();
    return NextResponse.json({ data: hero });
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json({ 
      data: null,
      error: "Failed to fetch hero data" 
    }, { status: 500 });
  }
}

export const PUT = auth0.withApiAuthRequired(async (request) => {
  try {
    // withApiAuthRequired already ensures user is authenticated
    // Read formData directly
    const formData = await request.formData();
    const avatarFile = formData.get("avatarFile");
    const avatarFromForm = formData.get("avatar");
    const avatarDataUrl = await toDataUrl(avatarFile, avatarFromForm);

    const payload = heroSchema.parse({
      avatar: avatarDataUrl ?? "",
      fullName: formData.get("fullName") ?? "",
      shortDescription: formData.get("shortDescription") ?? "",
      longDescription: formData.get("longDescription") ?? "",
    });

    const hero = await upsertHero(payload);
    return NextResponse.json({ message: "Hero updated", data: hero }, { status: 200 });
  } catch (error) {
    console.error("Error updating hero:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: error.message || "Failed to update hero section" 
    }, { status: 500 });
  }
});

async function toDataUrl(file, fallbackString) {
  const fallback = typeof fallbackString === "string" ? fallbackString.trim() : "";
  if (file && typeof file.arrayBuffer === "function") {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = path.extname(file.name || "") || ".bin";
      const mime = extTypeMap[ext] ?? file.type ?? "application/octet-stream";
      const tmp = path.join(os.tmpdir(), `${randomUUID()}${ext}`);
      
      fs.writeFileSync(tmp, buffer);
      try {
        const uri = await image2uri(tmp, { ext });
        return uri.startsWith("data:") ? uri : `data:${mime};base64,${uri}`;
      } finally {
        if (fs.existsSync(tmp)) {
          fs.rmSync(tmp, { force: true });
        }
      }
    } catch (error) {
      console.error("Error processing image file:", error);
      // Return fallback if file processing fails
      return fallback;
    }
  }
  return fallback;
}

