'use client';

import { useEffect } from 'react';
import { initClientInterceptor } from '@/lib/db-client-interceptor';

export default function ClientDbInitializer() {
  useEffect(() => {
    initClientInterceptor();
  }, []);

  return null;
}
