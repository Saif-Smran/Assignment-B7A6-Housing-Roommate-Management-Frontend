<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Codebase Workflow

Before starting any task, every agent must follow this sequence:


1. Run `bun run code` to refresh the codebase graph and snapshot with the latest files.
2. Read `projectCodeBase.md` to understand the current project structure and Graphify outputs.
3. Read `graphify-out/GRAPH_REPORT.md` and use `graphify-out/graph.json` or `graphify-out/graph.html` when architectural relationships need investigation.
4. Use the refreshed snapshot and graph as the initial context, then inspect individual source files only when deeper task-specific details are needed.
5. Complete the requested work and validate the changes.
6. Run `bun run code` again after the work is complete so the graph artifacts and `projectCodeBase.md` contain the final project state.

Do not begin implementation before completing the initial read, refresh, and reread. Do not finish a task without running the final refresh.
