import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    ConfigModule.forRoot(), // Pastikan ini ada dan udah di-import!
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465, // Kalau error terus, nanti kita coba ganti ke port 587 (secure: false)
            secure: true,
            auth: {
              user: config.get('GMAIL_USER'),
              pass: config.get('GMAIL_APP_PASSWORD'),
            },
          },
          defaults: {
            from: `"Admin Backend" <${config.get('GMAIL_USER')}>`,
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}