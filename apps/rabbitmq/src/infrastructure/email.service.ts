import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {

    private resend: Resend;
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly configService: ConfigService) {
        this.resend = new Resend(
            this.configService.get<string>('RESEND_API_KEY')
        )
    }

    async send(name: string, email: string, subject: string, body: string) {
        const { data, error } = await this.resend.emails.send({
            from: "no-reply <delivered+superchef@resend.dev>",
            to: [email],
            subject,
            html: "<h1>Hello " + name + "</h1><p>" + body + "</p>",
        })

        if (error) {
            this.logger.error("Error sending email:", error)
            throw new Error("Failed to send email")
        }

        this.logger.log("Email sent successfully:", data)
    }
}