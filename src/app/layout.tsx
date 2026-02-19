/**
 * Root Layout Component
 * 
 * This is the main layout for the entire application
 * 
 * Responsibilities:
 * 1. Set up document metadata (title, default styles)
 * 2. Provide theme context using next-themes (ThemeProvider)
 * 3. Provide Toast notifications (ToastProvider)
 * 4. Apply global CSS and font families
 * 5. Set up dark mode support
 * 
 * How Dark Mode Works:
 * 1. next-themes manages theme state (dark/light)
 * 2. Applies theme class to <html> element
 * 3. CSS variables in globals.css change based on .dark class
 * 4. All Tailwind classes respect the color variables
 * 
 * Structure:
 * - <html>: Root element with theme class applied
 * - <body>: Page content with providers
 * - children: Actual page content
 */

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast";
import "@/globals.css";

export const metadata: Metadata = {
  title: "Smart Bookmark - AI-Powered Bookmark Manager",
  description:
    "Save, organize, and manage your bookmarks with intelligent AI categorization. One-click saving with browser extension, dark mode support, and real-time sync.",
  keywords: [
    "bookmarks",
    "bookmark manager",
    "web clipper",
    "browser extension",
    "organization",
    "AI categorization",
  ],
  authors: [{ name: "Smart Bookmark Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smart-bookmark.app",
    title: "Smart Bookmark",
    description: "AI-Powered Bookmark Manager",
    images: [
      {
        url: "https://smart-bookmark.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Bookmark",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        {/* Theme Provider for Dark/Light Mode Support */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Toast Notification Provider */}
          <ToastProvider />

          {/* Page Content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
