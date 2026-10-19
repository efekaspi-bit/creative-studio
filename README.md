# Creative Studio

A web workspace for creative industry students to develop ideas, discuss briefs, and record their own decisions. Film, design, exhibitions, music, games, writing and other creative work are welcome. A brand or campaign brief is optional.

## What it does

- Freeform conversation through a server-side OpenAI Responses API integration.
- Separate projects with conversation history, unsent drafts and personal reflections.
- Browser-local saving and plain-text export.
- English or Turkish prompts, with examples to help start a project.
- Clear setup, billing, request-limit and connection errors; failed requests retain drafts.

## Current status

The interface, server route and error handling are implemented. Automated tests and the production build pass. A live API check on 19 October 2026 returned `credit_balance_exhausted`; successful live answers have not yet been verified. The hosted server secret has been configured separately from the ignored local environment file.

## Development

Requires Node.js 22.13 or newer. Install dependencies with `npm install`, then run `npm run dev`. Use `npm run build` for the production build and `node --test tests/creative-core.test.mjs` for the API adapter tests.

Runtime configuration: `OPENAI_API_KEY` (secret), optional `OPENAI_MODEL` (default `gpt-5-mini`). Configure these in the hosting environment; never place a key in client code, source control or the hosting manifest. The supplied Sites framework handles authentication and Worker deployment. Hosted `/api/chat` requires a signed-in user.

## How the code fits together

- `app/page.tsx`: workspace, projects, drafts, reflection and export.
- `app/globals.css`: responsive visual design.
- `app/api/chat/route.ts`: authenticated request handling and input limits.
- `lib/creative-core.mjs`: AI instructions, Responses API call and provider error handling.
- `tests/creative-core.test.mjs`: input and API adapter tests using simulated responses.

## Limits

Projects are stored in this browser, not synced across devices. Download important work before clearing browser storage. The assistant cannot browse, verify live facts, generate images or create files. Messages are sent to OpenAI when submitted; `store:false` is set for Responses requests, which is not a guarantee of zero provider retention.

Conversations are limited to 24 incoming messages and 24,000 characters. The per-user request limiter is in-memory per Worker instance, not a durable usage or spending cap. Stopping a request stops the browser waiting but may not stop upstream processing or charges. API usage needs an account with available credits. Keep the hosted app owner-private until stronger usage controls are implemented.
