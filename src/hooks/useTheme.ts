/**
 * useTheme Hook
 * 
 * Manages dark/light theme switching
 * 
 * Features:
 * - Read current theme from next-themes
 * - Toggle between dark and light modes
 * - Apply theme to HTML root element
 * - Persist theme preference
 * - System preference detection
 */

"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return {
    theme: mounted ? theme : "dark",
    isDark: mounted ? theme === "dark" : true,
    toggleTheme,
    mounted,
  };
}
