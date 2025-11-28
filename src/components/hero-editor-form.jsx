"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const heroSchema = z.object({
  avatar: z.string().trim().min(1).refine((v) => v.startsWith("data:"), "Avatar must be a data URL"),
  fullName: z.string().trim().min(2, { message: "Full name must be at least 2 characters" }).max(200, { message: "Full name must be at most 200 characters" }),
  shortDescription: z.string().trim().min(2, { message: "Short description must be at least 2 characters" }).max(120, { message: "Short description must be at most 120 characters" }),
  longDescription: z.string().trim().min(10, { message: "Long description must be at least 10 characters" }).max(5000, { message: "Long description must be at most 5000 characters" }),
});

const HERO_PLACEHOLDER_AVATAR = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: "...",
  shortDescription: "...",
  longDescription: "...",
};

export default function HeroEditorForm() {
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      avatar: HERO_PLACEHOLDER_AVATAR,
      fullName: "",
      shortDescription: "",
      longDescription: "",
    },
  });

  // Fetch hero data on mount
  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch("/api/hero");
        if (!response.ok) throw new Error("Failed to fetch hero data");
        const { data } = await response.json();
        
        if (data) {
          form.reset({
            avatar: data.avatar || HERO_PLACEHOLDER_AVATAR,
            fullName: data.fullName || defaultHeroContent.fullName,
            shortDescription: data.shortDescription || defaultHeroContent.shortDescription,
            longDescription: data.longDescription || defaultHeroContent.longDescription,
          });
        } else {
          form.reset({
            avatar: HERO_PLACEHOLDER_AVATAR,
            fullName: defaultHeroContent.fullName,
            shortDescription: defaultHeroContent.shortDescription,
            longDescription: defaultHeroContent.longDescription,
          });
        }
      } catch (error) {
        console.error("Error fetching hero:", error);
        toast.error("Failed to load hero data. Using defaults.");
        form.reset({
          avatar: HERO_PLACEHOLDER_AVATAR,
          fullName: defaultHeroContent.fullName,
          shortDescription: defaultHeroContent.shortDescription,
          longDescription: defaultHeroContent.longDescription,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchHero();
  }, [form]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setAvatarFile(file);

    // Convert to data URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      form.setValue("avatar", dataUrl, { shouldValidate: true });
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
      setAvatarFile(null);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("avatar", values.avatar);
        formData.append("fullName", values.fullName);
        formData.append("shortDescription", values.shortDescription);
        formData.append("longDescription", values.longDescription);
        
        if (avatarFile) {
          formData.append("avatarFile", avatarFile);
        }

        const response = await fetch("/api/hero", { method: "PUT", body: formData });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update hero");
        }

        const { data } = await response.json();

        form.reset({
          avatar: data.avatar,
          fullName: data.fullName,
          shortDescription: data.shortDescription,
          longDescription: data.longDescription,
        });

        setAvatarFile(null);
        toast.success("Hero section updated");
      } catch (error) {
        console.error("Error updating hero:", error);
        toast.error(error.message || "Failed to update hero. Please try again.");
      }
    });
  };

  if (isLoading) {
    return <p className="mt-4">Loading hero data...</p>;
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                        <img
                          src={field.value || HERO_PLACEHOLDER_AVATAR}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        <FormDescription className="mt-2">
                          Upload a new avatar image. The image will be converted to a data URL.
                        </FormDescription>
                      </div>
                    </div>
                    <Input
                      type="hidden"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormDescription>
                  Your full name as it will appear in the hero section.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Short Description */}
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter a short description (max 120 characters)" 
                    maxLength={120}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  A brief description (max 120 characters) that appears in the hero section.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Long Description */}
          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter a detailed description (10-5000 characters)" 
                    className="min-h-32"
                    maxLength={5000}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  A detailed description (10-5000 characters) about yourself.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={form.formState.isSubmitting || isPending}
          >
            {(form.formState.isSubmitting || isPending) ? "Updating..." : "Update Hero Section"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

