import type { Metadata } from "next";
import Script from "next/script";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/lib/query/provider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AniRohi - Stream Anime Free",
  description: "Watch your favorite anime series and movies in HD quality. Stream the latest episodes and discover new shows.",
  keywords: ["anime", "streaming", "watch anime", "anime online", "free anime"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakarta.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
