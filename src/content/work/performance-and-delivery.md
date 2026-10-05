---
title: "Dropping the first hypothesis, then making releases boring"
summary: "Traced a peak-hour slowdown that infrastructure metrics couldn't explain to a handful of database queries, then rebuilt the merge pipeline to take releases from days to hours."
company: "OpenSolar"
role: "Investigation lead & CI/CD owner"
period: "2024 - Present"
order: 4
metrics:
  - value: "~3 days → <4 h"
    label: "release cycle"
  - value: "~70%"
    label: "fewer integration regressions"
stack: ["PostgreSQL", "Query profiling", "Composite indexes", "Caching", "AWS (ALB, EC2, autoscaling)", "GitHub Actions", "Playwright"]
---

## Part 1: The afternoon slowdown

### The problem

European customers reported the platform slowing down every afternoon, consistently in line with the start of the US working day.

### The wrong hypothesis

The obvious suspect was AWS not scaling, so that's where I started: load balancer, EC2 utilisation, autoscaling. All healthy. Instances scaled and CPU wasn't the limiter. I dropped that story rather than keep tuning infrastructure to prove it.

### The real cause

p95 latency rose with US traffic while instance CPU stayed reasonable, and database time dominated a few dashboard endpoints. The process list showed the same aggregation queries stacking up: projects by stage for an organisation, joined with recent event activity. The event table is very large: fine at European traffic alone, heavy contention once both continents were online.

### The fix

- **Cheaper queries first.** Profiled the endpoints, tightened the queries and stopped fetching columns nothing used.
- **Indexes the dashboards actually needed** on `(org_id, created)` and the lookup columns they filtered by, so they stopped scanning a huge range of events. I checked write volume on the table before adding them.
- **Cache what doesn't need to be exact.** Org-level summary counts were cached with a short 60 to 90 second TTL. Anything a user had just written stayed uncached. Caching wasn't a substitute for the query fix: a cache over an expensive query just delays the stampede by 90 seconds.
- **Fewer requests.** The frontend made duplicate calls; we collapsed them.

Changes were load-tested in staging at roughly peak concurrency and rolled out gradually while watching p95 and database CPU.

### The result

Peak-hour latency returned to normal, and the team started watching expensive queries proactively instead of waiting for support tickets.

## Part 2: Making releases boring

### The problem

Releases took about three days because verification was manual. People skipped steps, and integration regressions got through.

### The approach

I treated it as an engineering problem, not a discipline problem. I wrote the GitHub Actions workflows (unit tests, Playwright end-to-end tests, security scanning and pre-commit checks) and made them the required path to merge on the default branch.

Adoption was the real work. I spent the first two weeks fixing flaky jobs, because the fastest way to kill a pipeline is to teach people it's safe to ignore. The objection was "this will slow us down"; the old process already took days. CI moved the waiting to a machine, and we measured merge time and escaped bugs to prove it.

### The result

- **Release cycle cut from ~3 days to under 4 hours.**
- **~70% fewer integration regressions** reaching production.

## What I learned

Don't marry your first hypothesis. Let evidence drive the investigation. And good process removes friction: if a safeguard is slow or flaky, people will route around it, so fixing that is part of building it.
