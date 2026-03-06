import { Controller, Post, Res, UseGuards, HttpStatus, HttpCode, Request, Body } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/admins/dto/create-user.dto';
import { SwitchTenantDto } from './dto/switch-tenant.dto';
import { JwtPayload } from 'src/types/jwt.interface';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: CreateUserDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });
    return { statusCode: 200, message: 'Logout berhasil' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('switch-tenant')
  @HttpCode(HttpStatus.OK)
  switchTenant(@Request() req: AuthenticatedRequest, @Body() switchTenantDto: SwitchTenantDto) {
    const user = req.user as JwtPayload;
    return this.authService.switchTenant(user, switchTenantDto);
  }
}
