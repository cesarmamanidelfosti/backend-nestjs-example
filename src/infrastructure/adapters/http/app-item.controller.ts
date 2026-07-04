import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CreateAppItemDto } from '../../../application/dtos/create-app-item.dto';
import { SaveAppItemUseCase } from '../../../application/use-cases/save-app-item.use-case';
import { AuthenticatedUser, JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { buildEnvelope } from '../../../shared/utils/response-helper';

@Controller('v1/app-items')
@UseGuards(JwtAuthGuard)
export class AppItemController {
  constructor(private readonly saveAppItemUseCase: SaveAppItemUseCase) {}

  @Post()
  async create(
    @Body() dto: CreateAppItemDto,
    @Req() request: Request & { user: AuthenticatedUser },
  ) {
    const item = await this.saveAppItemUseCase.execute({
      dto,
      createdBy: request.user.sub,
    });

    return buildEnvelope(201, true, 'Elemento registrado', item);
  }
}
