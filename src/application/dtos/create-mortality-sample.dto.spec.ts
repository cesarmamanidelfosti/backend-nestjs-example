import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateMortalitySampleDto } from './create-mortality-sample.dto';

async function validateDto(payload: Record<string, unknown>) {
  const dto = plainToInstance(CreateMortalitySampleDto, payload);
  return validate(dto);
}

describe('CreateMortalitySampleDto', () => {
  it('rejects a photoUrl that is not a valid URL', async () => {
    const errors = await validateDto({
      campaignId: 'campaign-001',
      quantity: 1,
      photoUrl: 'not-a-url',
    });

    expect(errors.some((e) => e.property === 'photoUrl')).toBe(true);
  });

  it('accepts a well-formed photoUrl', async () => {
    const errors = await validateDto({
      campaignId: 'campaign-001',
      quantity: 1,
      photoUrl: 'https://example.com/photo.jpg',
    });

    expect(errors).toHaveLength(0);
  });

  it('accepts a payload without photoUrl', async () => {
    const errors = await validateDto({
      campaignId: 'campaign-001',
      quantity: 1,
    });

    expect(errors).toHaveLength(0);
  });
});
