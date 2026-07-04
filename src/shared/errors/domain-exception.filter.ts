import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ParentNotFoundError } from '../../domain/errors';
import { buildEnvelope } from '../utils/response-helper';

@Catch(ParentNotFoundError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: ParentNotFoundError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response
      .status(HttpStatus.NOT_FOUND)
      .json(
        buildEnvelope(HttpStatus.NOT_FOUND, false, exception.message, null),
      );
  }
}
