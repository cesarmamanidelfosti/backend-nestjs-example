import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

function buildContext(headers: Record<string, string>) {
  const request: { headers: Record<string, string>; user?: unknown } = {
    headers,
  };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  let jwtService: jest.Mocked<JwtService>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;
    guard = new JwtAuthGuard(jwtService);
  });

  it('rejects requests without an Authorization header', async () => {
    await expect(guard.canActivate(buildContext({}))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects tokens that verify but have no sub claim', async () => {
    jwtService.verifyAsync.mockResolvedValue({});

    await expect(
      guard.canActivate(buildContext({ authorization: 'Bearer some-token' })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects tokens that fail verification', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));

    await expect(
      guard.canActivate(buildContext({ authorization: 'Bearer bad-token' })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('allows requests with a valid token and sub claim', async () => {
    jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });

    const context = buildContext({ authorization: 'Bearer good-token' });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
