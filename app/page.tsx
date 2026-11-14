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
        <WorkLog />
        <Projects />
        <Education />
        <Photography />
      </main>
      <Contact />
    </>
  );
}
