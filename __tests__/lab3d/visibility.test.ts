import { describe, expect, it } from 'vitest';

import { frameloopForVisibility } from '@/components/lab3d/visibility';

describe('frameloopForVisibility', () => {
  it('runs the scene while visible and pauses it when hidden', () => {
    expect(frameloopForVisibility(true)).toBe('always');
    expect(frameloopForVisibility(false)).toBe('never');
  });
});
