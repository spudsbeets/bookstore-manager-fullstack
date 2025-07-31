import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
   const { theme, setTheme } = useTheme();

   const cycleTheme = () => {
      if (theme === "light" || theme === "system") {
         setTheme("dark");
      } else {
         setTheme("light");
      }
   };

   const getIcon = () => {
      const root = window.document.documentElement;
      const isDark = root.classList.contains("dark");

      return isDark ? (
         <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
         <Sun className="h-[1.2rem] w-[1.2rem]" />
      );
   };

   return (
      <Button
         variant="outline"
         size="icon"
         onClick={cycleTheme}
         className="transition-all duration-200 hover:scale-105"
      >
         {getIcon()}
         <span className="sr-only">Toggle theme</span>
      </Button>
   );
}
