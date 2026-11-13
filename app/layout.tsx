import type { Metadata } from "next";
import { IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Header from "./components/Header";
import Starfield from "./components/Starfield";
import "./globals.css";

// Display: name and headings only.
const display = Instrument_Serif({
  variable: "--font-display-face",
  weight: "400",
  subsets: ["latin"],
});

// Body: 400 for running text, 500 reserved for UI emphasis.
const sans = IBM_Plex_Sans({
  variable: "--font-sans-face",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rohan Bharti",
  description:
    "Rohan Bharti: software engineer and CS student at UC Irvine. Previously a software developer intern on IBM watsonx; research engineer at the Xu Lab mapping neural circuits.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      {/* `isolate` keeps the -z-10 starfield above the body background. */}
      <body className="relative isolate flex min-h-full flex-col bg-bg text-fg">
        <Starfield />
        <Header />
        {children}
      </body>
    </html>
  );
}
