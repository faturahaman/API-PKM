import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RecaptchaService {
    async verify(token: string) {
        if (!token) {
            throw new UnauthorizedException('Silakan verifikasi reCAPTCHA Anda');
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        let recaptchaData: { success: boolean };
        try {
            const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
            recaptchaData = await recaptchaRes.json();
        } catch {
            throw new UnauthorizedException('Gagal menghubungi layanan reCAPTCHA');
        }

        if (!recaptchaData.success) {
            throw new UnauthorizedException('Verifikasi reCAPTCHA gagal');
        }

        return true;
    }
}
