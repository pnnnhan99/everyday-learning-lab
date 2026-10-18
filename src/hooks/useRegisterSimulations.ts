'use client';

import { useEffect } from 'react';
import { registerAllSimulations } from '@/simulations';

export function useRegisterSimulations() {
  useEffect(() => {
    registerAllSimulations();
  }, []);
}
