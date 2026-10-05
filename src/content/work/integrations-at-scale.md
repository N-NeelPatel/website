---
title: "Integrations are state machines: signing, ordering and permitting at scale"
summary: "Owned the services connecting OpenSolar to e-signature providers, equipment distributors and US permitting: 15K+ contracts a month at 99.7% success, and hand-offs that used to take days now take hours."
company: "OpenSolar"
role: "Owner, platform services & integrations"
period: "2024 - Present"
order: 2
metrics:
  - value: "15K+"
    label: "contracts / month"
  - value: "99.7%"
    label: "processing success"
  - value: "~300ms"
    label: "p95 API latency"
  - value: "2 days → <4 h"
    label: "quote-to-order"
stack: ["Django REST", "Event-driven pipelines", "Zappa", "AWS S3 & Lambda", "Signed webhooks", "OAuth2", "PostgreSQL"]
---

## The problem

An installer's job doesn't end in OpenSolar. Contracts go out for e-signature, equipment is ordered from distributors, and in the US permits are filed in a separate system. Every hand-off was a place where work got re-typed, delayed or silently lost.

Integrations look simple in a demo: call an API, get a response. In production they are distributed systems. The other side has its own data model, outages and opinion about state, and you control none of it.

## What I owned

Seven production platform services across document workflows, B2B ordering and partner connectivity: e-signatures with DocuSign and PandaDoc, distributor ordering with Segen, Wimada and PVF, and US permitting with SolarApp. I worked with product and the partners on requirements, then built and ran them in production.

## Signing: the assumption I killed

Support kept finding contracts that DocuSign or PandaDoc showed as complete but OpenSolar hadn't progressed, and fixing them by hand.

I traced the whole path: webhook, async job, database row, and the condition that advances the project. Matching envelope and document ids and timestamps to our rows, then replaying webhook payloads against our state transitions, showed the cause wasn't auth. It was ordering and duplicates. The code assumed every event arrives once, in order, and that "complete" on their side meant we'd applied it.

- **Idempotent handlers.** Read our row first; if it's already complete, do nothing.
- **Guarded transitions.** An illegal transition is logged and fails loudly instead of being skipped. Nothing advances until our state machine allows it.
- **Verify before trusting.** Webhook endpoints are open to the internet, so the signature check *is* the authentication. The body isn't trusted until it passes.
- **Don't rely on one POST.** A status reconcile pulls from the provider as a backup for webhooks that never arrive.
- **Logs with ids, not customer emails.**

## Permitting: owning the workflow, not the HTTP client

US installers were retyping entire projects into SolarApp to file a permit. I owned the OpenSolar → SolarApp workflow end to end: connecting the installer's account, mapping our project to their permit payload, submitting, persisting their project UUID on ours, polling status, uploading files and licences, and surfacing errors in-product.

The two data models don't match, and SolarApp can fail after we've started. So validation runs on our side first: missing required fields fail before we submit, not after their API rejects us. The UUID is stored only after a successful create; if they're down the user sees a clear error, and a retry reuses the existing UUID instead of double-creating.

Product wanted "one click, always works". I pushed for a readiness checklist, where a missing licence or address blocks submit, and we shipped it. That one decision saved a category of support tickets.

## Ordering

Distributor integrations turned a quote into an order without manual re-entry, running on event-driven async pipelines (Zappa on AWS Lambda, S3 for artefacts) so a slow distributor never blocks a user and work can be retried safely.

## The result

- **15K+ contracts a month at a 99.7% success rate**, with p95 API latency around 300ms across 50K+ monthly checkout sessions, and far fewer contracts stuck waiting for manual fixes.
- **Quote-to-order cut from 2 days to under 4 hours**, with ~40% less manual pricing work.
- **Permit filing reduced from hours of duplicate entry to minutes.**
- Services that contributed **~£1.2M ARR** from UK and EU expansion.

## What I'd do differently

Push for webhook-based status from SolarApp where the partner supports it, rather than only polling, and invest earlier in sandbox fixtures so we weren't testing against a partner's live quirks.
