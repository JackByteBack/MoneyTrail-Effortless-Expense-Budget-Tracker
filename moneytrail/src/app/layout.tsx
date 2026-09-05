import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoneyTrail — Know where your money actually goes",
  description:
    "A personal expense & budget tracker that makes logging transactions near-zero-effort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${GeistSans.className} ${GeistMono.className} bg-canvas text-ink antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
