import { Controller, Post, Res, UseGuards, HttpStatus, HttpCode, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ApiStandardResponse, ApiErrorResponses } from '../common/decorators/api-docs.decorator';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/admins/dto/create-user.dto';
import { SwitchTenantDto } from './dto/switch-tenant.dto';
import { JwtPayload } from 'src/types/jwt.interface';
import { AdminsService } from 'src/admins/admins.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { extractRequestMeta } from 'src/common/dto/request-meta.dto';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private adminsService: AdminsService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { ttl: 60000, limit: 5 }, medium: { ttl: 3600000, limit: 10 } })
  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticates a user and returns a JWT token along with user data and permitted tenants.'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiStandardResponse({ description: 'Login successful, returns JWT and user info' })
  @ApiErrorResponses()
  signIn(@Request() req: any, @Body() signInDto: CreateUserDto) {
    const requestMeta = extractRequestMeta(req);
    return this.authService.signIn(signInDto, requestMeta);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Logout',
    description: 'Invalidates the current session token and clears auth cookies.'
  })
  @ApiStandardResponse({ description: 'Logout successful' })
  @ApiErrorResponses()
  async logout(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    const user = req.user as JwtPayload;
    const requestMeta = extractRequestMeta(req);

    // Clear current_token from database to invalidate all sessions
    if (user?.sub) {
      await this.adminsService.updateCurrentToken(user.sub, '');
    }

    // Log the logout activity
    await this.authService.logout(user, requestMeta.ip_address, requestMeta.user_agent);

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
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Switch Active Tenant',
    description: 'Allows a multi-tenant user to switch their currently active Puskesmas/Tenant context.'
  })
  @ApiBody({ type: SwitchTenantDto })
  @ApiStandardResponse({ description: 'Tenant switched successfully, returns new session info' })
  @ApiErrorResponses()
  switchTenant(@Request() req: any, @Body() switchTenantDto: SwitchTenantDto) {
    const user = req.user as JwtPayload;
    const requestMeta = extractRequestMeta(req);
    return this.authService.switchTenant(user, switchTenantDto, requestMeta);
  }
}
