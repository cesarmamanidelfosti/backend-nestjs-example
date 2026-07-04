import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateMortalitySampleDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  cause?: string;

  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(280)
  notes?: string;
}
