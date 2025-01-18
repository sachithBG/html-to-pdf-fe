
import type { Metadata } from "next";
import localFont from "next/font/local";
import 'ckeditor5/ckeditor5.css';
import "./globals.css";
import ThemeProvidr from "@/provider/ThemeProvidr";
import ReduxProvider from "@/provider/ReduxProvider";
import ErrorBoundary from "./components/ErrorBoundary";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PDF Crafter",
  description: "PDF Crafter: HTML to PDF Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >

        <ErrorBoundary>
          <ReduxProvider>
            <ThemeProvidr>
              {children}
            </ThemeProvidr>
          </ReduxProvider>
        </ErrorBoundary>

      </body>
    </html >
  );
}
