import { NestFactory } from '@nestjs/core';
import { handler } from './app-item.handler';
import { ParentNotFoundError } from '../../../domain/errors';

jest.mock('@nestjs/core', () => ({
  NestFactory: { createApplicationContext: jest.fn() },
}));

describe('app-item lambda handler', () => {
  const close = jest.fn();
  let execute: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    execute = jest.fn();
    (NestFactory.createApplicationContext as jest.Mock).mockResolvedValue({
      get: () => ({ execute }),
      close,
    });
  });

  it('returns 401 when the authorizer context is missing', async () => {
    const result = await handler({ body: '{}' });

    expect(result.statusCode).toBe(401);
    expect(close).toHaveBeenCalled();
  });

  it('returns 201 with the created item on success', async () => {
    execute.mockResolvedValue({ id: 's1', parentId: 'parent-001' });

    const result = await handler({
      body: JSON.stringify({ parentId: 'parent-001', quantity: 2 }),
      requestContext: { authorizer: { claims: { sub: 'user-1' } } },
    });

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body) as { data: { parentId: string } };
    expect(body.data.parentId).toBe('parent-001');
  });

  it('returns 404 when the parent does not exist', async () => {
    execute.mockRejectedValue(new ParentNotFoundError('unknown'));

    const result = await handler({
      body: JSON.stringify({ parentId: 'unknown', quantity: 2 }),
      requestContext: { authorizer: { claims: { sub: 'user-1' } } },
    });

    expect(result.statusCode).toBe(404);
  });

  it('returns 500 on unexpected errors', async () => {
    execute.mockRejectedValue(new Error('boom'));

    const result = await handler({
      body: JSON.stringify({ parentId: 'parent-001', quantity: 2 }),
      requestContext: { authorizer: { claims: { sub: 'user-1' } } },
    });

    expect(result.statusCode).toBe(500);
  });
});
