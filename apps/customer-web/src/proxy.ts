import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // TODO: resolve request.nextUrl.hostname to tenant/outlet.
  // Example: mukulscafe.example.com -> tenant + outlet lookup.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
