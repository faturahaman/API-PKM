import { Controller, Post, Res, UseGuards, HttpStatus, HttpCode, Request, Body } from '@nestjs/common';
import express from 'express'; 
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/admins/dto/create-user.dto';


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
  async logout(@Request() req, @Res({ passthrough: true }) response: express.Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
    })
    return {
      statusCode: 200,
      message: 'Logout berhasil',
    };
  }
}