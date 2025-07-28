"use client";

import { useEffect, useState, ReactNode } from "react";

interface MountedProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: MountedProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;

  return <>{children}</>;
}
