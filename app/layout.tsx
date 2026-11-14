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

/**
 * First view: a load or refresh always starts at the top, and everything below the hero stays hidden
 * until the visitor scrolls, clicks or presses a key. A refresh drops any #hash left by the section
 * links; a shared #link still opens on its section, with everything visible. Smooth scrolling turns
 * on at the first interaction, so the browser's own load-time jumps are never animated.
 * Runs before first paint so nothing flashes. Without JS, everything is simply visible.
 */
const FIRST_VIEW_SCRIPT = `(function(){var d=document.documentElement,h=history;h.scrollRestoration="manual";var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"&&location.hash)h.replaceState(h.state,"",location.pathname+location.search);if(!location.hash)d.dataset.intro="";var ev=["wheel","touchmove","keydown","pointerdown","scroll"];function r(){delete d.dataset.intro;d.dataset.smooth="";ev.forEach(function(e){removeEventListener(e,r,true)})}ev.forEach(function(e){addEventListener(e,r,{capture:true,passive:true})})})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // FIRST_VIEW_SCRIPT sets data-intro before hydration
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      {/* `isolate` keeps the -z-10 starfield above the body background. */}
      <body className="relative isolate flex min-h-full flex-col bg-bg text-fg">
        <script dangerouslySetInnerHTML={{ __html: FIRST_VIEW_SCRIPT }} />
        <Starfield />
        <Header />
        {children}
      </body>
    </html>
  );
}
