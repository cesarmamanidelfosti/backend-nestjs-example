import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { CampaignNotFoundError } from '../../domain/errors';
import { buildEnvelope } from '../utils/response-helper';

@Catch(CampaignNotFoundError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: CampaignNotFoundError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response
      .status(HttpStatus.NOT_FOUND)
      .json(
        buildEnvelope(HttpStatus.NOT_FOUND, false, exception.message, null),
      );
  }
}
