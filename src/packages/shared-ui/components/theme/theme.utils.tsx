import { MonitorCog, Moon, Sun } from "lucide-react";

export function getNextTheme(theme: string | undefined): string {
  if (!theme) return "system";

    switch (theme) {
      case "dark":
        return "light";
      case "light":
        return "system";
      case "system":
        return "dark";
      default:
        return "system";
    }
}
  
export function getIcon(theme: string): React.ReactNode {
    switch (theme) {
      case "dark":
        return <Moon />;
      case "light":
        return <Sun />;
      case "system":
        return <MonitorCog />;
    }
  }
  