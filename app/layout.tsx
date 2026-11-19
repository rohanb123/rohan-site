import type { Metadata } from "next";
import { Archivo, Schibsted_Grotesk } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

// Display: name, headings and section labels. Variable, so it can be pushed wide on its width axis (.font-display).
const display = Archivo({
  variable: "--font-display-face",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Body: 400 for running text, 500 reserved for small UI emphasis.
const sans = Schibsted_Grotesk({
  variable: "--font-sans-face",
  weight: ["400", "500"],
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
 * It also restores the hero scene saved by SceneSwitch (data-scene), so the palette never flashes.
 * Runs before first paint so nothing flashes. Without JS, everything is simply visible.
 */
const FIRST_VIEW_SCRIPT = `(function(){var d=document.documentElement,h=history;try{var s=localStorage.getItem("scene");if(s==="mist"||s==="bridge")d.dataset.scene=s}catch(e){}h.scrollRestoration="manual";var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"&&location.hash)h.replaceState(h.state,"",location.pathname+location.search);if(!location.hash)d.dataset.intro="";var ev=["wheel","touchmove","keydown","pointerdown","scroll"];function r(){delete d.dataset.intro;d.dataset.smooth="";ev.forEach(function(e){removeEventListener(e,r,true)})}ev.forEach(function(e){addEventListener(e,r,{capture:true,passive:true})})})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // FIRST_VIEW_SCRIPT sets data-intro and data-scene before hydration
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-bg text-fg">
        <script dangerouslySetInnerHTML={{ __html: FIRST_VIEW_SCRIPT }} />
        <Header />
        {children}
      </body>
    </html>
  );
}
