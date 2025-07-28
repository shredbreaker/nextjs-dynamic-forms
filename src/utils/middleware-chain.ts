import { NextMiddleware, NextResponse } from "next/server";

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export const createMiddlewareChain = (factories: MiddlewareFactory[], index: number = 0): NextMiddleware => {
  const current = factories[index];
  if (current) {
    const next = createMiddlewareChain(factories, index + 1);
    return current(next);
  }

  return () => NextResponse.next();
};
