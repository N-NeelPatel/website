---
title: "ONBO: engineer number one, from an idea to paying customers"
summary: "Joined with no repo, no conventions and no team. Set an architecture built to be changed, shipped the MVP in four months, and grew a team of four that could ship without me."
company: "ONBO"
role: "Founding engineer & tech lead"
period: "2022 - 2023"
order: 3
metrics:
  - value: "4 months"
    label: "idea to enterprise MVP"
  - value: "~70%"
    label: "fewer production defects"
  - value: "2 days → <8 h"
    label: "mean time to recovery"
  - value: "4"
    label: "engineers hired & led"
stack: ["Django", "FastAPI", "PostgreSQL", "React", "TypeScript"]
---

## The problem

ONBO set out to fix enterprise employee onboarding: the first 90 days most companies run on spreadsheets and email. When I joined as the first engineer there was an idea and some designs. No repo, no conventions, no playbook, and requirements that changed weekly.

## What I owned

The first architecture, the data model and API conventions, the engineering practices and, as we grew, hiring and leading the engineers building on top of it.

## Architecture built to be changed

**Boring, on purpose.** Django for the product, tenancy, admin and ORM. FastAPI for a few isolated high-throughput paths. One PostgreSQL database. I wouldn't sell that as two platforms. It was one product with the right tool in two places.

**Conventions before the second hire.** A multi-tenant data model and shared API and error conventions meant engineer two didn't invent a new style per endpoint. I worked with frontend on the React structure and shared components for the same reason.

**What I deliberately didn't build.** No microservices. No custom workflow engine. No perfect role-based access in week one. Journeys were modelled by role, department and location so steps could be added later. The rule was simple: if it unblocked a paying customer's journey, it shipped; if it only made the diagram prettier, it waited.

**A shared debugging path.** Structured logging, validation and playbooks meant anyone could find a problem, not just me. That's what took defects down ~70% and recovery time from days to hours.

## Delegating a surface, not tickets

Being the default backend decision-maker doesn't scale. When I hired our second backend engineer, I handed him a whole surface: scheduled notifications for onboarding journeys. The constraints were written down: every send org-scoped, retry-safe and never sent twice.

He proposed the table and API before writing code, and we reviewed them together: a unique key on organisation, journey, step and recipient; what happens if the worker dies after sending; how a journey is cancelled. Then he built it and owned it.

The first version could still double-send if the worker died after the email went out but before the row was updated. That was a gap in my briefing, because "retry-safe" wasn't precise enough. We fixed it with an outbox row written in the same transaction, and I changed how I specify side effects, not who owned the work.

## The result

- **Enterprise MVP in 4 months**, with first paying customers within 6 months of launch.
- **~70% fewer production defects** and **MTTR cut from ~2 days to under 8 hours**.
- **A team of 4** holding ~80% sprint commitment across 3 major releases in 18 months.

## What I learned

I'm not proud that we used Django. I'm proud the decisions were reversible, and that other people could ship confidently when I wasn't the only one who understood the system. In hindsight I'd have made "notify the right people exactly once" a domain concept earlier, instead of waiting until it became a product surface.
