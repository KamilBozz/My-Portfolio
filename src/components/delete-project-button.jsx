"use client";

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ id }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if(!window.confirm("Are you sure you want to delete this project?")) {
            return;
        }

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });
            if(!response.ok) {
                toast.error("Failed to delete project");
            } else {
                toast.success("Project deleted successfully");
                router.refresh();
                router.replace("/projects");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project");
        }
    }
    return (
        <Button variant="destructive" onClick={() => startTransition(handleDelete)}>
            {isPending ? 'Deleting...' : "Delete"}
        </Button>
    )
}