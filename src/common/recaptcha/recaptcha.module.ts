import { Module, Global } from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';

@Global()
@Module({
    providers: [RecaptchaService],
    exports: [RecaptchaService],
})
export class RecaptchaModule { }
