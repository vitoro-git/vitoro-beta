"use client";

import { cn } from "@/lib/utils";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

const HEIGHT = "h-9";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div className="flex justify-between items-center px-1">
      <div>
        <p className="font-semibold text-muted-foreground text-xs">Theme</p>
        <p className="font-semibold">{theme === "light" ? "Light" : "Dark"}</p>
      </div>
      <div
        className={cn(
          "relative bg-secondary border-2 rounded-full w-fit aspect-[2/1] transition-colors duration-500 cursor-pointer",
          "flex items-center",
          HEIGHT,
          theme === "light" ? "bg-orange-300" : "bg-purple-950"
        )}
        onClick={toggleTheme}
      >
        <div className="flex flex-1 justify-center">
          <MoonStar className={cn("text-muted-foreground")} />
        </div>
        <div className="flex flex-1 justify-center">
          <SunMedium className={cn("text-muted-foreground")} />
        </div>
        <div
          className={cn(
            "top-0 absolute bg-muted rounded-full h-full aspect-square transition-all duration-500 ease-in-out",
            theme === "light" ? "left-0" : "left-[53%]"
          )}
        />
      </div>
    </div>
  );
}
