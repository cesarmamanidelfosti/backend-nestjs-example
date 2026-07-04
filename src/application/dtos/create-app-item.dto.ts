import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateAppItemDto {
  @IsString()
  @IsNotEmpty()
  parentId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  attachmentUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(280)
  notes?: string;
}
