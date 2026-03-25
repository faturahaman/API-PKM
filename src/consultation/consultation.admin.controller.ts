import { Controller, Get, Body, Param, Patch, Delete, Query, UseGuards, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiSuccessResponse,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
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

@ApiTags('Admin Consultation')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('admin/consultation')
export class ConsultationAdminController {
  constructor(private readonly consultationService: ConsultationService) { }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Consultations (Admin)',
    description: 'Returns a paginated list of all consultations with optional search.',
    useCases: [
      'Admin dashboard for consultation management',
      'Viewing all patient questions',
      'Filtering consultations'
    ],
    behavior: [
      'Returns all consultations (answered and pending)',
      'Supports search by patient name or question content'
    ]
  })
  @ApiPaginationParams()
  @ApiQuery({ name: 'search', required: false, description: 'Search term for consultation' })
  @ApiPaginatedResponse({ description: 'Paginated list of consultations' })
  @ApiErrorResponses()
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
  @ApiOperationDetailed({
    summary: 'Reply to Consultation',
    description: 'Admin replies to a patient consultation question.',
    useCases: [
      'Answering patient questions',
      'Providing health consultation',
      'Completing consultation request'
    ],
    behavior: [
      'Sets consultation as answered',
      'Records answer and timestamp',
      'Sanitizes input for security'
    ]
  })
  @ApiParam({ name: 'id', description: 'Consultation ID', example: '1' })
  @ApiBody({ type: ReplyConsultationDto, description: 'Reply content' })
  @ApiStandardResponse({ description: 'Reply sent successfully' })
  @ApiErrorResponses()
  reply(
    @Param('id') id: string,
    @Body() body: ReplyConsultationDto,
  ) {
    return this.consultationService.replyConsultation(+id, body.answer);
  }

  @Patch(':id')
  @ApiOperationDetailed({
    summary: 'Update Consultation',
    description: 'Updates consultation details or status.',
    useCases: [
      'Marking as urgent',
      'Updating consultation metadata'
    ]
  })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiBody({ type: UpdateConsultationDto, description: 'Fields to update' })
  @ApiStandardResponse({ description: 'Consultation updated successfully' })
  @ApiErrorResponses()
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateConsultationDto
  ) {
    return this.consultationService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperationDetailed({
    summary: 'Delete Consultation',
    description: 'Permanently removes a consultation from the system.',
    useCases: [
      'Removing test consultations',
      'Cleaning up old data',
      'Data management'
    ],
    notes: [
      'This action is irreversible'
    ]
  })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiSuccessResponse('Consultation deleted successfully', 'Consultation has been removed')
  @ApiErrorResponses()
  remove(@Param('id') id: string) {
    return this.consultationService.remove(+id);
  }
}