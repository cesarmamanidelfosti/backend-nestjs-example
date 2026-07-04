import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { DomainExceptionFilter } from './domain-exception.filter';
import { ParentNotFoundError } from '../../domain/errors';

describe('DomainExceptionFilter', () => {
  it('maps ParentNotFoundError to a 404 envelope', () => {
    const filter = new DomainExceptionFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({ getResponse: () => ({ status }) }),
    } as unknown as ArgumentsHost;

    filter.catch(new ParentNotFoundError('parent-999'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Parent parent-999 not found',
      }),
    );
  });
});
