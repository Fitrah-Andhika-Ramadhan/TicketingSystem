'use client';

import { useEffect } from 'react';
import { initClientInterceptor } from '@/lib/db-client-interceptor';

export default function ClientDbInitializer() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DB === 'true') {
      initClientInterceptor();
    }
  }, []);

  return null;
}
