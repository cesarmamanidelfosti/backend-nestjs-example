import { buildEnvelope } from './response-helper';

describe('buildEnvelope', () => {
  it('defaults data to null when omitted', () => {
    const envelope = buildEnvelope(200, true, 'ok');

    expect(envelope.data).toBeNull();
    expect(envelope.code).toBe(200);
    expect(envelope.success).toBe(true);
    expect(envelope.message).toBe('ok');
  });

  it('carries the provided data payload', () => {
    const envelope = buildEnvelope(201, true, 'created', { id: '1' });

    expect(envelope.data).toEqual({ id: '1' });
  });
});
