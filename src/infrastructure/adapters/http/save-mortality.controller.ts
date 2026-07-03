import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CreateMortalitySampleDto } from '../../../application/dtos/create-mortality-sample.dto';
import { SaveMortalityUseCase } from '../../../application/use-cases/save-mortality.use-case';
import { AuthenticatedUser, JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { buildEnvelope } from '../../../shared/utils/response-helper';

@Controller('v1/save-mortality')
@UseGuards(JwtAuthGuard)
export class SaveMortalityController {
  constructor(private readonly saveMortalityUseCase: SaveMortalityUseCase) {}

  @Post()
  async create(
    @Body() dto: CreateMortalitySampleDto,
    @Req() request: Request & { user: AuthenticatedUser },
  ) {
    const sample = await this.saveMortalityUseCase.execute({
      dto,
      registeredBy: request.user.sub,
    });

    return buildEnvelope(201, true, 'Muestra de mortalidad registrada', sample);
  }
}
