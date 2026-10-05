// Single source of truth for the site's content. Update here, not in components.
//
// Every metric below comes from Neel's CV / fact sheet. Don't add numbers that
// can't be backed up in an interview, and keep ownership claims precise:
// on Ada, Neel owned the backend (orchestration, tool contract, write path,
// registration engine, tests) - not the chat UI or the voice experience.

export const profile = {
  name: "Neel Patel",
  location: "London, UK",
  headline: "Senior backend & AI engineer",
  pitch:
    "I build the parts of production systems that can't be wrong: the write path behind AI agents, and the integrations B2B platforms depend on when the other side fails.",
  intro:
    "5+ years building backend-heavy SaaS in Python, Django and PostgreSQL. At OpenSolar I own platform integrations and the backend of Ada, a production AI agent used by 3,500+ solar installer organisations. Before that I was the first engineer at ONBO, where I set the architecture and grew the team to four.",
  roles: ["Senior Backend", "Founding Engineer", "Distributed Systems & AI", "Forward Deployed"],
  email: "neel.patel3337@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/neelpatel0007/",
    github: "https://github.com/N-NeelPatel",
    x: "https://x.com/NTPatel_07",
  },
};

export const metrics = [
  { value: "28K+", label: "AI agent conversations per month" },
  { value: "112K+", label: "Agent tool calls per month" },
  { value: "15K+", label: "Contracts processed monthly at 99.7% success" },
  { value: "42 → 8 min", label: "Installer onboarding time with Ada" },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: "OpenSolar",
    role: "Senior Software Engineer",
    period: "Feb 2024 - Present",
    location: "London, UK",
    summary:
      "Platform integrations and AI for a SaaS solar installers use to design, quote, contract and order projects.",
    points: [
      "Own the backend of Ada, OpenSolar's production AI agent: orchestration, the tool contract and every path that writes customer data. Moved it from a thin Assistants API wrapper with 2 or 3 tools to ~20 server-side tools that the model can only request: the server validates, executes in the user's org and streams status. 28K+ conversations and 112K+ tool calls a month, backed by 900+ automated tests.",
      "Built Ada's registration engine as an explicit step machine with pending review, so scraped company data never publishes itself, cutting installer onboarding from 42 to 8 minutes with 83% completion and time-to-first-project by 58%.",
      "Designed and shipped 7 production platform services (document workflows, B2B ordering and partner connectivity) on event-driven async pipelines with signed webhooks and OAuth2, contributing ~£1.2M ARR from UK/EU expansion.",
      "Own e-signature processing (DocuSign, PandaDoc) handling 15K+ contracts a month at 99.7% success, with p95 API latency around 300ms across 50K+ monthly checkout sessions; made webhook handling idempotent and state-guarded after tracing contracts that providers marked complete but we hadn't applied.",
      "Built distributor ordering (Segen, Wimada, PVF), cutting quote-to-order from 2 days to under 4 hours and manual pricing work by ~40%, and the SolarApp permitting workflow that turned hours of duplicate data entry into minutes.",
      "Wrote the GitHub Actions pipeline that gates every merge (unit, Playwright E2E, security scanning, pre-commit), taking releases from ~3 days to under 4 hours with ~70% fewer integration regressions.",
    ],
    stack: ["Python", "Django", "OpenAI Responses API", "PostgreSQL", "AWS", "Zappa", "WebSockets"],
  },
  {
    company: "Labra.io",
    role: "Software Engineer",
    period: "Oct 2023 - Jan 2024",
    location: "Bengaluru, India",
    summary: "Cloud marketplace and co-sell platform for software vendors.",
    points: [
      "Built integrations with the AWS, GCP and Azure marketplaces for a listing management product that helps software companies co-sell with cloud providers.",
    ],
    stack: ["AWS Marketplace", "GCP", "Azure", "APIs"],
  },
  {
    company: "ONBO",
    role: "Founding Engineer & Tech Lead",
    period: "Apr 2022 - Sep 2023",
    location: "Bengaluru, India",
    summary: "Enterprise employee-onboarding SaaS. Joined as employee #1: no repo, no conventions, no playbook.",
    points: [
      "Set the first architecture: Django for the product, tenancy and admin, FastAPI for a few isolated high-throughput paths, one PostgreSQL. Multi-tenant model and API/error conventions so every new engineer built the same way.",
      "Modelled onboarding journeys by role, department and location so steps could be added later, and deliberately didn't build microservices or a custom workflow engine. Enterprise MVP in 4 months; first paying customers within 6.",
      "Introduced a shared debugging path (structured logging, validation, playbooks), cutting production defects by ~70% and MTTR from ~2 days to under 8 hours.",
      "Hired and led a team of 4 engineers. Delegated whole surfaces behind a design review rather than tickets, ran planning and code review, and held ~80% sprint commitment across 3 major releases in 18 months.",
    ],
    stack: ["Django", "FastAPI", "PostgreSQL", "React", "TypeScript"],
  },
  {
    company: "Crest Data Systems",
    role: "Software Engineer (intern → full-time)",
    period: "Jan 2021 - Apr 2022",
    location: "Ahmedabad, India",
    summary: "Splunk apps and add-ons for enterprise IT and security monitoring.",
    points: [
      "Built company-wide Jenkins CI/CD for Splunk third-party add-ons (build, lint, package, staged deploy), cutting manual release effort by ~60%.",
      "Led the migration of 100+ Splunk add-ons from SimpleXML/jQuery to React with a shared component library, speeding up feature delivery by ~40%.",
      "Built a WebDriverIO end-to-end test framework wired into Jenkins that reduced client-reported defects by 17% quarter on quarter.",
    ],
    stack: ["Python", "React", "Splunk", "Jenkins", "Docker", "MongoDB"],
  },
];

export const principles = [
  {
    title: "The model proposes, the server decides",
    body: "An LLM never touches an API directly. It requests a named tool; my code validates the arguments, runs it as that user in that org, and can refuse. Every write is something I can test, log and reject.",
  },
  {
    title: "Integrations are state machines",
    body: "Webhooks arrive late, twice or out of order, and partners go down mid-request. Handlers are idempotent, transitions are guarded, and a pull-based reconcile backs up every push.",
  },
  {
    title: "Count before you fan out",
    body: "Anything that emails, notifies or mutates many tenants gets a dry run with a number I can explain, a hard cap and a second pair of eyes. I treat it with the same care as a migration.",
  },
  {
    title: "Follow the evidence",
    body: "The first hypothesis is often wrong. I measure, correlate and let the data decide where the real bottleneck is. Then I drop the story I started with.",
  },
  {
    title: "Make the safe path the easy path",
    body: "CI, tests and guardrails should remove friction, not add ceremony. If a safeguard is flaky or slow, people route around it, so I fix that first.",
  },
  {
    title: "Delegate surfaces, not tickets",
    body: "I hand engineers a whole problem with written constraints and review the data model and contract before the code. Then they own it, and I'm not the bottleneck.",
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "C++"] },
  { group: "Backend", items: ["Django / DRF", "FastAPI", "Node.js", "REST & webhooks", "OAuth2", "Event-driven pipelines", "Idempotency & outbox patterns"] },
  { group: "AI", items: ["LLM agents & tool calling", "OpenAI Responses & Assistants APIs", "RAG / vector stores", "Streaming (WebSockets)", "Tool validation & guardrails"] },
  { group: "Data", items: ["PostgreSQL", "Query & index tuning", "Caching", "MongoDB"] },
  { group: "Infrastructure", items: ["AWS (Lambda, S3, API Gateway, EC2)", "Zappa", "Docker", "GitHub Actions", "Jenkins", "Playwright"] },
];
