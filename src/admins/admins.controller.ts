import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
export class AdminsController {
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Get('dashboard')
  getDashboard(@Request() req) {
    return req.user;
  }
} 
