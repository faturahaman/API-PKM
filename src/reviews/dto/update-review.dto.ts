import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateReviewDto {
  @IsNotEmpty()
  @IsBoolean()
  is_publish: boolean;
}