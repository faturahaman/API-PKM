import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

async sendMail(to: string, subject: string, message: string) {
  try {
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      text: message, 
    });
    return { message: 'Email sukses dikirim!' };
  } catch (error) {
    // Re-throw error for caller to handle
    throw error;
  }
}
}