import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      name: req.user.name,
      photo: req.user.photo,
    };
  }

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return req.user;
  }
}
