# GitHub Copilot Instructions

Follow `/Users/larryrobinson/Documents/note app/AGENTS.md` for repository rules.

## Copilot Behavior
- Prefer small, focused changes that match the current code style.
- Do not introduce secrets or credentials into tracked files.
- Do not modify JSON data snapshots in `data/` unless requested.
- Avoid adding dependencies unless necessary for the requested task.

## Validation Expectations
- For app changes, ensure the app can start with `npm start`.
- For mobile-only changes, follow `/Users/larryrobinson/Documents/note app/mobile/README.md`.

## Handoff Expectations
- Summarize modified files.
- Include verification steps performed.
- Mention env vars or migrations if applicable.
