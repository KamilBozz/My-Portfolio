import { auth0 } from "@/lib/auth0";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import NewProjectForm from "./new-project-form";

export default async function NewProjectPage() {
    const headersList = await headers();
    const cookieStore = await cookies();
    
    // Create a request-like object with headers
    const requestHeaders = new Headers();
    
    // Copy all headers
    headersList.forEach((value, key) => {
        requestHeaders.set(key, value);
    });
    
    // Add cookies to the request headers
    const cookieHeader = cookieStore
        .getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
    
    if (cookieHeader) {
        requestHeaders.set('cookie', cookieHeader);
    }
    
    const request = new Request('http://localhost', {
        headers: requestHeaders,
    });
    
    const session = await auth0.getSession(request);
    
    if (!session?.user) {
        notFound();
    }
    
    return <NewProjectForm />;
}

