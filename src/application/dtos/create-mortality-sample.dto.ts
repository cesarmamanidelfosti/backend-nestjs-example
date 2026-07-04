import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
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

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(280)
  notes?: string;
}
