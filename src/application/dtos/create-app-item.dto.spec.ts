import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAppItemDto } from './create-app-item.dto';

async function validateDto(payload: Record<string, unknown>) {
  const dto = plainToInstance(CreateAppItemDto, payload);
  return validate(dto);
}

describe('CreateAppItemDto', () => {
  it('rejects an attachmentUrl that is not a valid URL', async () => {
    const errors = await validateDto({
      parentId: 'parent-001',
      quantity: 1,
      attachmentUrl: 'not-a-url',
    });

    expect(errors.some((e) => e.property === 'attachmentUrl')).toBe(true);
  });

  it('accepts a well-formed attachmentUrl', async () => {
    const errors = await validateDto({
      parentId: 'parent-001',
      quantity: 1,
      attachmentUrl: 'https://example.com/photo.jpg',
    });

    expect(errors).toHaveLength(0);
  });

  it('accepts a payload without attachmentUrl', async () => {
    const errors = await validateDto({
      parentId: 'parent-001',
      quantity: 1,
    });

    expect(errors).toHaveLength(0);
  });
});
