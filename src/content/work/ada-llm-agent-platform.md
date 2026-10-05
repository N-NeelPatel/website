---
title: "Ada: making an AI agent safe to write production data"
summary: "Owned the backend of OpenSolar's AI agent (orchestration, the tool contract and the write path) and moved it from a thin chatbot wrapper to ~20 server-side tools used by 3,500+ installer organisations."
company: "OpenSolar"
role: "Backend owner: orchestration, tool contract & write path"
period: "2024 - Present"
order: 1
metrics:
  - value: "28K+"
    label: "conversations / month"
  - value: "112K+"
    label: "tool calls / month"
  - value: "900+"
    label: "automated tests"
  - value: "42 → 8 min"
    label: "installer onboarding"
stack: ["Python", "Django", "OpenAI Responses API", "Assistants API", "Vector stores", "WebSockets", "PostgreSQL"]
---

## The problem

Ada started as "can we put an LLM in the product?" That isn't a production problem. The production problem is that the model is probabilistic, and the tools it calls create projects and write customer data for thousands of installer organisations.

When I picked it up, Ada was a thin Django wrapper around OpenAI's Assistants API. Conversation state lived in OpenAI's threads, there were two or three tools, and Django mostly forwarded messages. Fine for questions and answers. Dangerous the moment the agent could create a project.

## What I owned

I owned the backend: orchestration, the tool contract, the Responses API path, the registration step engine, and the test and reliability strategy. A frontend engineer owned the chat UI and WebSocket client; a PM owned which workflows shipped and the prompt copy. My name is on everything that can write to the database.

## The architecture

I split the backend into four parts:

- **Router and factory.** Chooses the assistant and model path (Responses API, with Assistants kept as a fallback when a prompt isn't configured) and who is allowed to use it. No big-bang rewrite.
- **Tool contract.** Each of ~20 tools is a named server-side callable with a JSON schema and an `execute(user, org, args)` implementation. The model proposes a call; the server decides.
- **Runtime.** Streams events over WebSockets, collects tool calls, validates arguments, executes them and sends status ("creating project…") so a 30-second tool loop never looks frozen.
- **Registration engine.** Indexes a handful of the installer's own web pages for context, runs named steps (business details, location, services), writes a registration log and marks the result **pending review**. Scraped data never publishes itself to a live organisation.

**Tenancy is enforced by construction.** Tools run as the authenticated user, inside their organisation, and load records through the same org-scoped queries as the rest of the product. A project id the model invents never reaches an unscoped query, and a registration session from another user returns a 404.

**The tool result is the source of truth.** A model can say "done" when a tool failed. The model only summarises what the tool actually returned, and a step isn't complete until the tool succeeds.

## The design I rejected

One proposal was to give the model a single generic tool, "call any OpenSolar API", instead of twenty specific ones. It looks like less code. It's actually far more surface: the model invents paths and extra fields, staff and global routes live in the same router, and a tenancy bug in any one view becomes the agent's bug for every installer.

Rather than argue about taste, I built a spike: the same prompt against a generic REST tool and a typed `create_project` tool. The generic path attempted a write with fields a model should never be able to set. Alongside a list of the dangerous path prefixes that exist in our router, the decision made itself.

We shipped typed tools with schemas, a narrow allowlisted read helper for search-style questions, and kept every write on a named tool.

## The hardest incident

The address-to-project tool waits on auto-design, which can take up to about two minutes. In production a stream dropped mid-wait, the user retried, and we created a second project at the same address.

I made the tool idempotent on organisation and address: a recent project at the same address is treated as the same job, overwriting requires an explicit flag, and a timeout is no longer treated as "create again".

## The result

- **28K+ conversations and 112K+ tool calls a month** across 3,500+ installer organisations in the UK and EU.
- **Onboarding cut from 42 minutes to 8**, with 83% completion, through the registration engine.
- **Time-to-first-project down 58%** by turning a natural-language address into a designed project.
- **900+ automated tests** covering schemas, auth, org scoping, registration steps, session IDOR and tool argument validation, plus tool-error rate watched in production, not just "did the model reply".

## What I'd do differently

Build evaluation sets earlier: unit tests catch an invalid schema, but not the model choosing the wrong tool with valid arguments. Make every write tool idempotent from day one, rather than after the duplicate-project incident. And draw a clearer line between prompts and platform, so a prompt change can't silently change tool behaviour.

Getting a good answer from an LLM is easy. Making an agent safely change production state is the job.
