// Fichier: frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// On configure la police pour utiliser une variable CSS
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans", // <--- MODIFICATION 1
});

export const metadata: Metadata = {
  title: "Attendance Record",
  description: "Plateforme de gestion des présences",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/* On applique la variable de police ici */}
      <body className={inter.variable}> {/* <--- MODIFICATION 2 */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}