"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { setTheme, theme } = useTheme();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-end p-4 h-16 border-b border-white/10">
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">{user?.email}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="bg-transparent border-slate-700 hover:bg-slate-800"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}