import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Copy from "../../components/Copy";
import DemoSlot from "../../components/DemoSlot";
import SectionLabel from "../../components/SectionLabel";
import { caseStudies, getCaseStudy } from "../../content/case-studies";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: `${study.title} | Rohan Bharti`, description: study.dek };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const i = caseStudies.indexOf(study);
  const next = caseStudies[(i + 1) % caseStudies.length];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-gutter pb-24">
      <nav className="pt-10 font-mono text-[11px] uppercase tracking-[0.16em]">
        <Link href="/#work" className="text-fg-muted transition-colors duration-200 hover:text-accent">
          ← Rohan Bharti
        </Link>
      </nav>

      <header className="pt-20 pb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2">{study.context}</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] text-fg sm:text-7xl">{study.title}</h1>
        <p className="mt-5 max-w-measure text-lg leading-relaxed text-fg-muted sm:text-xl">{study.dek}</p>
        <p className="mt-6 font-mono text-[11px] uppercase leading-6 tracking-[0.12em] text-fg-subtle">
          {study.stack.join(" · ")}
        </p>
      </header>

      <DemoSlot demo={study.demo} title={study.title} />

      <Block index="01" title="Problem">
        <Paragraphs items={study.problem} />
      </Block>

      <Block index="02" title="My role">
        <Paragraphs items={study.role} />
      </Block>

      <Block index="03" title="Constraints">
        <Bullets items={study.constraints} />
      </Block>

      <Block index="04" title="Key decisions & trade-offs">
        <ol className="space-y-8">
          {study.decisions.map((d) => (
            <li key={d.decision} className="max-w-measure">
              <p className="leading-relaxed text-fg">
                <Copy text={d.decision} />
              </p>
              <p className="mt-2 grid grid-cols-[6rem_1fr] gap-3 text-[15px] leading-relaxed">
                <span className="pt-[3px] font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">Trade-off</span>
                <span className="text-fg-muted">
                  <Copy text={d.tradeoff} />
                </span>
              </p>
            </li>
          ))}
        </ol>
        <h3 className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">What failed</h3>
        <div className="mt-3">
          <Bullets items={study.failures} />
        </div>
      </Block>

      <Block index="05" title="Outcome">
        <ul className="max-w-measure space-y-3">
          {study.outcome.map((o) => (
            <li key={o} className="grid grid-cols-[1.25rem_1fr] text-lg leading-relaxed text-fg-heading">
              <span aria-hidden="true" className="text-accent">
                ▪
              </span>
              <span>
                <Copy text={o} />
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block index="06" title="What I'd do differently">
        <Paragraphs items={study.differently} />
      </Block>

      <footer className="mt-24 flex flex-wrap items-baseline justify-between gap-6 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.16em]">
        <Link href="/#work" className="text-fg-muted transition-colors duration-200 hover:text-accent">
          ← All work
        </Link>
        <Link
          href={`/case-studies/${next.slug}`}
          className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
        >
          Next: {next.title} →
        </Link>
      </footer>
    </main>
  );
}

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section aria-labelledby={id} className="pt-20">
      <SectionLabel index={index} title={title} id={id} />
      <div className="md:pl-[calc(13rem+3rem)]">{children}</div>
    </section>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="max-w-measure space-y-4 leading-relaxed text-fg">
      {items.map((t) => (
        <p key={t}>
          <Copy text={t} />
        </p>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-measure space-y-2 leading-relaxed text-fg-muted">
      {items.map((t) => (
        <li key={t} className="grid grid-cols-[1rem_1fr]">
          <span aria-hidden="true" className="text-fg-subtle">
            –
          </span>
          <span>
            <Copy text={t} />
          </span>
        </li>
      ))}
    </ul>
  );
}
