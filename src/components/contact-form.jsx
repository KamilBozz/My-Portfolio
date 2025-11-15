"use client";
import { Button } from "@/components/ui/button";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ContactForm() {
    
    const contactFormSchema = z.object({
        name: z.string().min(2, { message: "Your name is too short", }).max(200),
        email: z.string().email({ message: "Please enter a valid email address" }),
        message: z.string().min(2, { message: "Your message is too short", }).max(200),
    })
    const contactForm = useForm({
        resolver: zodResolver(contactFormSchema),
        defaultValues: { name: "", email: "", message: "" },
    })


    function onSubmit(values) {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('message', values.message)

        fetch('/api/contact-me', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.ok) {
                toast.success(data.message || "Message sent successfully!")
            } else {
                toast.error(data.message || data.error || "Failed to send message")
            }
        })
        .catch(error => {
            console.error("Error sending contact message:", error);
            toast.error("Failed to send message. Please try again.")
        })
    }

    return(
        <div className="flex justify-center items-center py-8">
            <div className="w-full max-w-2xl px-4">
                <Form {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={contactForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={contactForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={contactForm.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Your message" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}