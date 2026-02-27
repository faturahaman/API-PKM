import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

async sendMail(to: string, subject: string, message: string) {
  // Tambahin ini buat ngecek apakah service nerima alamat emailnya:
  console.log('Alamat tujuan:', to); 
  
  try {
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      text: message, 
    });
    return { message: 'Email sukses dikirim!' };
  } catch (error) {
    console.log('Error dari Nodemailer:', error);
    throw error;
  }
}
}