import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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

export const viewport: Viewport = {
  themeColor: "#06b6d4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Anirohi - Stream Anime Free",
  description:
    "Watch your favorite anime series and movies in HD quality. Stream the latest episodes and discover new shows.",
  keywords: ["anime", "streaming", "watch anime", "anime online", "free anime"],
  applicationName: "Anirohi",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Anirohi",
  },
  openGraph: {
    title: "Anirohi - Stream Anime Free",
    description:
      "Watch your favorite anime series and movies in HD quality. Stream the latest episodes and discover new shows.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anirohi - Stream Anime Free",
    description:
      "Watch your favorite anime series and movies in HD quality. Stream the latest episodes and discover new shows.",
  },
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
        <NuqsAdapter>
          <QueryProvider>
            <div className="pt-[env(safe-area-inset-top)]">{children}</div>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
