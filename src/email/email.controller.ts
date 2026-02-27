import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

// Bikin DTO simpel di sini aja biar rapi
export class SendEmailDto {
  to: string;
  subject: string;
  message: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
async sendEmail(@Body() body: any) {
  
  return this.emailService.sendMail(body.to, body.subject, body.message);
}
}