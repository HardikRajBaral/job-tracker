import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const session = await getSession();

  const isInDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  if (isInDashboardPage && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const isInSignInPage = request.nextUrl.pathname.startsWith("/sign-in");
  const isInSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");

  if ((isInSignInPage || isInSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard ", request.url));
  }

  return NextResponse.next();
}
