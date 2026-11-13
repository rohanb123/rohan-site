import About from "./components/About";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import WorkLog from "./components/WorkLog";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <About />
        <WorkLog />
        <Projects />
        <Education />
      </main>
      <Contact />
    </>
  );
}
