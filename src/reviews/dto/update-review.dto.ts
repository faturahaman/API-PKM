import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateReviewStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  is_publish: boolean;
}