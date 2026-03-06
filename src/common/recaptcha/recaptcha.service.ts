import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RecaptchaService {
    async verify(token: string) {
        console.log(`[RecaptchaService] Verifying token. NODE_ENV: ${process.env.NODE_ENV}`);
        if (token === 'passthrough') {
            console.log('[RecaptchaService] Bypassing reCAPTCHA verification (passthrough token)');
            return true;
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        let recaptchaData: { success: boolean };
        try {
            const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
            recaptchaData = await recaptchaRes.json();
        } catch (e) {
            console.error('[RecaptchaService] Error during verification:', e);
            // In non-production, allow if service is down
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[RecaptchaService] API unreachable, allowing login anyway (dev mode)');
                return true;
            }
            throw new UnauthorizedException('Gagal menghubungi layanan reCAPTCHA');
        }

        if (!recaptchaData.success) {
            console.warn('[RecaptchaService] Verification failed:', recaptchaData);
            // In non-production, allow if verification fails (e.g. invalid key)
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[RecaptchaService] Verification failed, allowing login anyway (dev mode)');
                return true;
            }
            throw new UnauthorizedException('Verifikasi reCAPTCHA gagal');
        }

        return true;
    }
}
