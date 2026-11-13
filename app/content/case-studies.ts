// Case studies. Facts and numbers come only from resume.ts.
// Anything the resume does not support is a "[NEEDED: ...]" placeholder for Rohan to fill in.

export type Decision = {
  /** What was decided. */
  decision: string;
  /** What it cost or what was traded away. */
  tradeoff: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** Org / event line shown above the title. */
  context: string;
  /** Short line under the title. */
  dek: string;
  /** Live demo or video. `null` renders a [NEEDED] slot. */
  demo: { kind: "video"; src: string; poster?: string } | { kind: "link"; href: string; label: string } | null;
  problem: string[];
  role: string[];
  constraints: string[];
  decisions: Decision[];
  /** What failed or was abandoned along the way. */
  failures: string[];
  /** Resume numbers only. */
  outcome: string[];
  differently: string[];
  stack: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "autonomous-rover",
    title: "Autonomous Rover",
    context: "Cal Hacks · SpaceXAI Track",
    dek: "A voice-tasked Mars rover that picks its own science targets and keeps its data through link loss.",
    demo: null,
    problem: [
      "[NEEDED: the problem in 2 to 3 sentences. What does a real rover struggle with that this addresses?]",
    ],
    role: [
      "[NEEDED: team size and which parts you personally owned]",
    ],
    constraints: [
      "Ran on a Raspberry Pi 5 and an NVIDIA GX10.",
      "[NEEDED: hackathon time limit, power, link or latency limits you designed around]",
    ],
    decisions: [
      {
        decision:
          "Extended NASA's AEGIS from single-target to multi-target selection: top-k ranking plus route ordering, scored by SigLIP with logistic regression.",
        tradeoff: "[NEEDED: what this cost, e.g. accuracy vs. the sub-300 ms scoring budget]",
      },
      {
        decision:
          "Delay-tolerant downlink: a persistent store-and-forward queue that drains its backlog on reconnect.",
        tradeoff: "[NEEDED: what you gave up, e.g. freshness, storage, complexity]",
      },
      {
        decision: "SpacetimeDB behind a 5 Hz telemetry pipeline (IMU, sonar, link health) with live dashboard and run replay.",
        tradeoff: "[NEEDED: why SpacetimeDB over the alternatives, and its cost]",
      },
    ],
    failures: ["[NEEDED: something that didn't work and what you changed]"],
    outcome: [
      "Sub-300 ms ML scoring for multi-target selection.",
      "No data loss across reconnects.",
      "Sub-500 ms live telemetry dashboard at 5 Hz, with run replay.",
    ],
    differently: ["[NEEDED: what you'd do differently next time]"],
    stack: ["SigLIP", "Logistic Regression", "Grok", "SpacetimeDB", "Linux/ARM", "Raspberry Pi 5", "NVIDIA GX10"],
  },
  {
    slug: "xu-lab-spatial-pipeline",
    title: "Spatial imaging pipeline",
    context: "Xu Lab · Center for Neural Circuit Mapping",
    dek: "Automating an imaging pipeline and classifying 2M+ brain cells to see which neurons are wired into a circuit.",
    demo: null,
    problem: ["[NEEDED: the research question and why the old pipeline was a bottleneck]"],
    role: [
      "Research Engineer at the Xu Lab, UC Irvine (Mar 2026 – present).",
      "[NEEDED: what you owned vs. what the lab already had]",
    ],
    constraints: [
      "40K+ fields of view to process.",
      "A 15-step conda and Linux imaging pipeline.",
      "[NEEDED: compute, storage, or data-quality limits]",
    ],
    decisions: [
      {
        decision: "Automated the 15-step conda and Linux imaging pipeline end to end across all fields of view.",
        tradeoff: "[NEEDED: what automation cost, e.g. flexibility for one-off runs]",
      },
      {
        decision: "Classified cells with MapMyCell and UMAP.",
        tradeoff: "[NEEDED: why these tools, and their limits]",
      },
      {
        decision: "Built QC tooling (AnnData, scanpy) that validates gene expression against Allen Brain Atlas data.",
        tradeoff: "[NEEDED: what the QC check can and can't catch]",
      },
    ],
    failures: ["[NEEDED: something that didn't work and what you changed]"],
    outcome: [
      "2M+ brain cells classified.",
      "72% of 15.9K circuit-connected neurons found to be excitatory.",
      "Processing time cut by 35%.",
      "Gene expression validated against the Allen Brain Atlas at r = 0.71.",
    ],
    differently: ["[NEEDED: what you'd do differently next time]"],
    stack: ["Python", "conda", "Linux", "MapMyCell", "UMAP", "AnnData", "scanpy"],
  },
  {
    slug: "ibm-agentic-etl",
    title: "Agentic ETL",
    context: "IBM · watsonx.data intelligence",
    dek: "An MCP-integrated agentic pipeline that raised ingestion throughput 5× while cutting LLM output and cost.",
    demo: null,
    problem: ["[NEEDED: what ingestion looked like before, and why it needed to be faster or cheaper]"],
    role: [
      "Software Developer Intern on watsonx.data intelligence (Jun – Sep 2026).",
      "[NEEDED: what you owned end to end vs. with the team]",
    ],
    constraints: [
      "LLM output size and per-call cost.",
      "[NEEDED: latency, data, security or platform constraints you can share]",
    ],
    decisions: [
      {
        decision: "Built the ETL pipeline as MCP-integrated agents with LLM batching.",
        tradeoff: "[NEEDED: what batching traded away, e.g. per-item latency or error isolation]",
      },
      {
        decision: "A tiktoken budget with 3-tier field stripping and empty-response retries.",
        tradeoff: "[NEEDED: what got stripped and how you protected quality]",
      },
      {
        decision: "Re-architected NL-to-knowledge-graph around a graph-native data layer.",
        tradeoff: "[NEEDED: migration cost or what got harder]",
      },
    ],
    failures: ["[NEEDED: something that didn't work and what you changed]"],
    outcome: [
      "Ingestion throughput up 5×.",
      "LLM output cut 40%, with lower per-call cost.",
      "Knowledge-graph write operations cut by 50%.",
    ],
    differently: ["[NEEDED: what you'd do differently next time]"],
    stack: ["MCP", "LLM batching", "tiktoken", "Knowledge graphs"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
