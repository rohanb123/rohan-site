// All site content, taken from Rohan_Bharti_Resume.pdf. Real names and numbers only.

export type Job = {
  org: string;
  team?: string;
  role: string;
  dates: string;
  location: string;
  /** One line for the compact timeline, drawn from the bullets below. */
  summary: string;
  /** Full resume bullets; the source facts for the summary (not shown on the home page). */
  points: string[];
};

export type Project = {
  id: string;
  name: string;
  year: string;
  context: string;
  /** Each tool is tagged with the layer of the stack it lives in; the layer sets its dot color. */
  stack: { name: string; layer: Layer }[];
  summary: string;
  points: string[];
  /** Public link (repo, demo, devpost). Only add real URLs supplied by Rohan. */
  url?: string;
};

/** Bottom of the stack first: the order of the Projects legend. */
export const LAYERS = ["Hardware", "Data & Infra", "ML", "Product"] as const;
export type Layer = (typeof LAYERS)[number];

export const work: Job[] = [
  {
    org: "IBM",
    team: "watsonx.data intelligence",
    role: "Software Developer Intern",
    dates: "Jun 2026 – Sep 2026",
    location: "San Jose, CA",
    summary: "Built an agentic ETL pipeline that raised ingestion throughput 5×.",
    points: [
      "Increased ingestion throughput 5× by building an MCP-integrated agentic ETL pipeline with LLM batching.",
      "Cut LLM output 40% and per-call cost with a tiktoken budget, 3-tier field stripping and empty-response retries.",
      "Re-architected the NL-to-knowledge-graph flow around a graph-native data layer, cutting write operations by 50%.",
    ],
  },
  {
    org: "Xu Lab",
    team: "Center for Neural Circuit Mapping",
    role: "Research Engineer",
    dates: "Mar 2026 – Present",
    location: "Irvine, CA",
    summary: "Imaging pipeline and cell classification across 2M+ brain cells.",
    points: [
      "Classified 2M+ brain cells (MapMyCell, UMAP) and found 72% of 15.9K circuit-connected neurons were excitatory.",
      "Automated a 15-step conda and Linux imaging pipeline across 40K+ fields of view, cutting processing time by 35%.",
      "Built Python QC tooling (AnnData, scanpy) validating gene expression against Allen Brain Atlas data (r = 0.71).",
    ],
  },
  {
    org: "7 Leaves Cafe",
    role: "Software Consultant",
    dates: "Jan 2026 – Mar 2026",
    location: "Irvine, CA",
    summary: "Customer warehouse and segmentation across 30 SoCal sites.",
    points: [
      "Built a PostgreSQL warehouse and k-means segments for ~830K Gen Z and ~600K Millennial customers across 30 SoCal sites.",
      "Sized a $7.8B café market (12.7% CAGR) in Plotly dashboards, ranking drivers (81% pricing, 71% taste).",
    ],
  },
  {
    org: "CareTech",
    role: "Machine Learning Engineer",
    dates: "Oct 2025 – Mar 2026",
    location: "Irvine, CA",
    summary: "Meal-scanning vision model; precision and recall from 63% to 95%.",
    points: [
      "Built a cognitively accessible diet tracker that scans meals with YOLOv8 (300 classes) served via FastAPI.",
      "Curated 28K+ images with HSV, scale and mosaic augmentation; ran ablations guided by confusion-matrix errors.",
      "Raised precision and recall from 63% to 95% by tuning learning rate, batch size, image size and confidence/NMS thresholds.",
    ],
  },
  {
    org: "Magic Software",
    role: "Software Engineer Intern",
    dates: "Jun 2023 – Oct 2023",
    location: "San Francisco, CA",
    summary: "Sensor pipeline ingesting 5M+ readings from embedded devices.",
    points: [
      "Deployed a Node.js pipeline on Azure Data Explorer ingesting 5M+ sensor readings from embedded devices.",
      "Clustered machine-state data into 4 operational states, linking transitions to 60% of hardware breakdowns.",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "rover",
    name: "Autonomous Rover",
    year: "2026",
    context: "Cal Hacks · SpaceXAI Track",
    stack: [
      { name: "SigLIP", layer: "ML" },
      { name: "Logistic Regression", layer: "ML" },
      { name: "Linux/ARM", layer: "Hardware" },
      { name: "SpacetimeDB", layer: "Data & Infra" },
    ],
    summary:
      "A voice-tasked Mars rover built with Grok, SigLIP and SpacetimeDB on a Raspberry Pi 5 and NVIDIA GX10.",
    points: [
      "Extended NASA's AEGIS to multi-target selection: top-k ranking and route ordering with sub-300 ms ML scoring.",
      "Delay-tolerant downlink: a persistent store-and-forward queue that drains its backlog on reconnect with no data loss.",
      "5 Hz telemetry pipeline (IMU, sonar, link health) with a sub-500 ms live dashboard and run replay.",
    ],
  },
  {
    id: "galaxy",
    name: "Galaxy Merger Prediction",
    year: "2024",
    context: "Harvard",
    stack: [
      { name: "Keras", layer: "ML" },
      { name: "TensorFlow", layer: "ML" },
      { name: "CNN", layer: "ML" },
      { name: "Computer Vision", layer: "ML" },
    ],
    summary:
      "Detecting galaxy mergers at z = 2 across 15.4K simulated Hubble images from Illustris-1, labeled via merger trees.",
    points: [
      "Trained a Keras network on dual-band optical and near-IR 75×75 cutouts, reaching 72.7% test accuracy.",
    ],
  },
  {
    id: "gteam",
    name: "GTeam",
    year: "2026",
    context: "Y Combinator",
    stack: [
      { name: "Semantic Search", layer: "Product" },
      { name: "Voyage AI", layer: "ML" },
      { name: "pgvector", layer: "Data & Infra" },
      { name: "Claude API", layer: "ML" },
      { name: "Zero Entropy", layer: "ML" },
    ],
    summary:
      "A team knowledge base that unifies members' notes into one semantic search system with Voyage AI and Claude.",
    points: [
      "Cut search noise with pgvector HNSW indexing and Zero Entropy ranking, plus Claude paper-to-project matching.",
    ],
  },
  {
    id: "clearpath",
    name: "ClearPath",
    year: "2026",
    context: "UC San Diego",
    stack: [
      { name: "Python", layer: "Data & Infra" },
      { name: "FastAPI", layer: "Data & Infra" },
      { name: "Next.js", layer: "Product" },
      { name: "RAG", layer: "ML" },
      { name: "ChromaDB", layer: "Data & Infra" },
      { name: "Browser Use", layer: "ML" },
    ],
    summary:
      "A supply chain compliance platform: Trade.gov sanctions screening with parallel RAG and LLM checks.",
    points: [],
  },
];

/** Interests, as listed on the resume. */
export const interests = ["Assistive BCIs", "Propulsion systems", "Bionic limbs & robotics", "Photography"];

export const education = {
  school: "University of California, Irvine",
  degree: "B.S. Computer Science",
  /** Concentrations */
  focus: ["AI & Machine Learning", "Embedded Systems"],
  dates: "Expected Jun 2028",
  gpa: "3.9",
  awards: [
    "2× Samsung Solve for Tomorrow State Finalist ($5,000)",
    "2025 Perplexity Case Competition Finalist",
  ],
  involvement: [
    "Irvine Consulting Group: Director of Technology, Consultant",
    "Anthropic Claude Builder Club",
  ],
};

export const contact: { label: string; value: string; href: string; icon?: "github" | "linkedin" }[] = [
  { label: "Email", value: "rohan17bharti@gmail.com", href: "mailto:rohan17bharti@gmail.com" },
  { label: "GitHub", value: "github.com/rohanb123", href: "https://github.com/rohanb123", icon: "github" },
  { label: "LinkedIn", value: "linkedin.com/in/robharti", href: "https://www.linkedin.com/in/robharti/", icon: "linkedin" },
];
