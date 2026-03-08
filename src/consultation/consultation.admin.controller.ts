import { Controller, Get, Body, Param, Patch, Delete, Query, UseGuards, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConsultationService } from './consultation.service';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { SanitizeText } from '../common/decorators/sanitize.decorator';

export class ReplyConsultationDto {
  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  answer: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('admin/consultation')
export class ConsultationAdminController {
  constructor(private readonly consultationService: ConsultationService) { }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.consultationService.findAllAdmin(p, l, search);
  }

  @Post(':id/reply')
  @HttpCode(HttpStatus.OK)
  reply(
    @Param('id') id: string,
    @Body() body: ReplyConsultationDto,
  ) {
    return this.consultationService.replyConsultation(+id, body.answer);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateConsultationDto
  ) {
    return this.consultationService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationService.remove(+id);
  }
}