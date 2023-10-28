import { Inter } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const geistVariable = GeistMono.variable + " " + GeistSans.variable;
