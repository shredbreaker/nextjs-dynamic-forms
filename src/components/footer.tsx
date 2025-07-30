import React from "react";
import { SocialLinksBar } from "./social-links-bar";

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto w-full py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-0">
        {/* Bottom Section */}

        <div className="flex w-full flex-row items-center justify-center space-x-2 p-0">
          <SocialLinksBar />

          <span className="text-muted-foreground text-sm">© 2025 All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
