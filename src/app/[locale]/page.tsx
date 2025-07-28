"use client";

import { Link } from "@/i18n/navigation";

export default function Home() {
  const links = [
    { href: "/domain-editor/001", label: "Domain Editor" },
    { href: "/domain-editor/002", label: "Domain Editor" },
    { href: "/domain-editor/003", label: "Domain Editor" },
  ];

  return (
    <div className="bg-muted flex h-dvh w-full flex-col items-center justify-start space-y-8 p-8">
      <Logo />
      <nav className="flex flex-col space-x-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex flex-row space-x-4 tracking-wide uppercase">
      <div className="flex w-full items-center justify-center text-center">
        <span className="text-muted font-open-sans rounded-xl bg-amber-800 p-6 py-4 text-7xl">D</span>
      </div>

      <div className="font-open-sans flex flex-col space-y-0 text-3xl font-medium tracking-wide">
        <span>Dynamic</span>
        <span>Form</span>
        <span>Builder</span>
      </div>
    </div>
  );
};
