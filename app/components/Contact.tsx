import { contact } from "../content/resume";
import CopyEmail from "./CopyEmail";
import Section from "./Section";
import SocialIcon from "./SocialIcon";

export default function Contact() {
  const email = contact.find((c) => c.label === "Email")!;
  const profiles = contact.filter((c) => c.icon);
  return (
    <Section id="contact" as="footer" className="pb-36">
      <CopyEmail email={email.value} className="font-display text-[clamp(1.5rem,4.5vw,3rem)] font-light tracking-[-0.02em] break-words" />
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {profiles.map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2">
            <SocialIcon name={c.icon!} />
            {c.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </p>
    </Section>
  );
}
