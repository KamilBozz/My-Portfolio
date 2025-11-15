import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
    try {
        const formData = await req.formData()
        const name = formData.get('name')
        const email = formData.get('email')
        const message = formData.get('message')

        console.log("Received contact message:", {name, email, message})

        // Validate required fields
        if (!name || !email || !message) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Only send email if Resend is configured
        let emailSent = false
        let emailError = null
        if (process.env.RESEND_API_KEY && process.env.RESEND_FROM && process.env.RESEND_TO) {
            try {
                // Clean the subject line - remove newlines and limit length
                const cleanSubject = `Contact from ${name}: ${message.replace(/\r?\n/g, ' ').slice(0, 50)}`
                
                const result = await resend.emails.send({
                    from: process.env.RESEND_FROM,
                    to: process.env.RESEND_TO,
                    subject: cleanSubject,
                    html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
                    replyTo: email,
                })
                
                // Check if there's an error in the response
                if (result.error) {
                    console.error("Resend API error:", result.error)
                    emailError = result.error.message || "Failed to send email"
                } else if (result.data) {
                    console.log("Email sent successfully:", result.data)
                    emailSent = true
                } else {
                    console.error("Unexpected response from Resend:", result)
                    emailError = "Unexpected response from email service"
                }
            } catch (err) {
                console.error("Error sending email:", err)
                emailError = err.message || "Failed to send email"
            }
        } else {
            console.log("Resend not configured, skipping email send")
        }

        return Response.json({ 
            ok: emailSent, 
            message: emailSent 
                ? "Email sent successfully" 
                : emailError 
                    ? `Message received but email failed: ${emailError}` 
                    : "Message received (email not configured)", 
            email: email, 
            name: name, 
            message: message,
            error: emailError || undefined
        }, { status: 200 })
    } catch (error) {
        console.error("Error sending contact message:", error)
        return Response.json({ error: "Internal server error", details: error.message }, { status: 500 })
    }
}