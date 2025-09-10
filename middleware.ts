import { NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

import { auth } from '@/lib/auth';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'ja', 'zh'],
  defaultLocale: 'en',
});

export default auth((request: NextRequest) => {
  return I18nMiddleware(request);
});

export const config = {
  matcher: ['/', '/login', '/register', '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
