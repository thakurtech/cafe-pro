import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    const isLoginPath = request.nextUrl.pathname.startsWith('/login');
    const isStaticPath = request.nextUrl.pathname.match(/\.(png|jpg|jpeg|svg|css|js|ico)$/);

    if (!user && !isLoginPath && !isStaticPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user && isLoginPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
