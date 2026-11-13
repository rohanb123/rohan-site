import Contact from "./components/Contact";
import Education from "./components/Education";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Starfield from "./components/Starfield";
import WorkLog from "./components/WorkLog";

export default function Home() {
  return (
    // `isolate` keeps the -z-10 starfield above the body background.
    <div className="relative isolate flex flex-1 flex-col">
      <Starfield />
      <main className="flex-1">
        <Hero />
        <WorkLog />
        <Projects />
        <Education />
      </main>
      <Contact />
    </div>
  );
}
