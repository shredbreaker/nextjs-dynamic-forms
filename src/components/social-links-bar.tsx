import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import Link from "next/link";
import { memo } from "react";
import { Button } from "@shared-ui/shadcn/components/ui/button";

export const SocialLinksBar = memo(function SocialLinksBar() {
  return (
    <div className="flex flex-row items-center justify-center">
      <Link
        href="https://www.linkedin.com/in/andrei-solovev/"
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <Button variant="ghost" size="sm">
          <IconBrandLinkedin className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          LinkedIn
        </Button>
      </Link>

      <Link href="https://github.com/shredbx" target="_blank" rel="noopener noreferrer" className="group">
        <Button variant="ghost" size="sm">
          <IconBrandGithub className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          GitHub
        </Button>
      </Link>

      {/* <Link href="https://shredb.com" target="_blank" rel="noopener noreferrer" className="group">
        <Button variant="ghost" size="sm">
          <IconWorldWww className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          Website
        </Button>
      </Link> */}
    </div>
  );
});
