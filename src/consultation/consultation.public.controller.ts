import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@ApiTags('Public Consultation')
@Controller('consultation')
export class ConsultationPublicController {
  constructor(private readonly consultationService: ConsultationService) { }
  @Post()
  @ApiOperationDetailed({
    summary: 'Submit Consultation Request',
    description: 'Patients or users can submit a health consultation question.',
    useCases: [
      'Asking health-related questions',
      'Requesting medical consultation',
      'Getting health information'
    ],
    behavior: [
      'Creates new consultation request',
      'Sets status to pending',
      'Records submission timestamp'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Optional recaptcha validation may be enabled'
    ]
  })
  @ApiBody({ type: CreateConsultationDto, description: 'Consultation request data' })
  @ApiCreatedResponseDoc('Consultation submitted successfully', 'Your consultation request has been submitted')
  @ApiErrorResponses()
  create(@Body() createDto: CreateConsultationDto) {
    return this.consultationService.create(createDto);
  }

  @Get()
  @ApiOperationDetailed({
    summary: 'List Public Consultations',
    description: 'Returns a list of answered consultations for public viewing.',
    useCases: [
      'Viewing answered health questions',
      'Health education from previous consultations',
      'FAQ-style content'
    ],
    behavior: [
      'Returns only answered (published) consultations',
      'Supports pagination'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Only shows answered consultations'
    ]
  })
  @ApiPaginationParams()
  @ApiPaginatedResponse({ description: 'List of answered consultations' })
  @ApiErrorResponses()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.consultationService.findAllPublic(page, limit);
  }
}