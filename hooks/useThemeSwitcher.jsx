import { useState, useEffect } from "react";

const useThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Only after mounting, we can safely access localStorage and window
  useEffect(() => {
    setMounted(true);

    // Get saved theme from localStorage if available
    const savedTheme = localStorage.getItem("theme");

    // Check if user has a system preference
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set theme based on saved preference or system preference
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }, []);

  // Effect to apply theme changes to DOM
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // Remove both classes and add the current one
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Update localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  return [theme, toggleTheme, mounted];
};

export default useThemeSwitcher;
