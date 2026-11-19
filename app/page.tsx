import Contact from "./components/Contact";
import Education from "./components/Education";
import Hero from "./components/Hero";
import Photography from "./components/Photography";
import Projects from "./components/Projects";
import WorkLog from "./components/WorkLog";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        {/* Held back on first load (see FIRST_VIEW_SCRIPT in layout) until the visitor scrolls or clicks */}
        <div data-below-fold>
          <WorkLog />
          <Projects />
          <Education />
          <Photography />
        </div>
      </main>
      <div data-below-fold>
        <Contact />
      </div>
    </>
  );
}
