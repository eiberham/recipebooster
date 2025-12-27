import { Resend } from "resend";

export class EmailService {
    private resend = new Resend(process.env.RESEND_API_KEY!);

    async send(name: string, email: string, subject: string, body: string) {
        const { data, error } = await this.resend.emails.send({
            from: "no-reply <delivered+superchef@resend.dev>",
            to: [email],
            subject,
            html: "<h1>Hello " + name + "</h1><p>" + body + "</p>",
        });

        if (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email");
        }

        console.log("Email sent successfully:", data);
    }
}