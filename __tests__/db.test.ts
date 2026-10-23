import { beforeEach, describe, expect, it } from 'vitest';
import { getElementById } from '@/lib/db';
import { resetDb } from '@/lib/sqlite';

describe('getElementById', () => {
  beforeEach(() => resetDb());

  it('should return an element if it exists', async () => {
    await expect(getElementById('lemon')).resolves.toMatchObject({
      id: 'lemon',
      name: 'Lemon Juice',
      type: 'acid',
    });
  });

  it('should return null if the element does not exist', async () => {
    await expect(getElementById('missing-element')).resolves.toBeNull();
  });
});
