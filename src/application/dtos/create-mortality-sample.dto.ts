import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
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
}
