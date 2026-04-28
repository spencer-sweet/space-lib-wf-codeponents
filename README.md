# Webflow Code Components Intro

Starter repository for building React + TypeScript components that can be adapted for Webflow Code Components.

## Quick start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run locally:

   ```bash
   pnpm dev
   ```

3. Build:

   ```bash
   pnpm build
   ```

4. Deploy components to Webflow:

   ```bash
   pnpm deploy
   ```

## FYI

- `@webflow/webflow-cli` - CLI used to publish components to Webflow
- `@webflow/data-types` - TypeScript definitions for Webflow props
- `@webflow/react` - React utilities for code components

## Project structure

```text
src/
  components/
    SimpleCard/
      SimpleCard.tsx
      SimpleCard.css
      SimpleCard.webflow.tsx
```

`SimpleCard.webflow.tsx` is the Webflow-facing wrapper entry for the component.

## Next steps for Webflow publishing

- Replace the placeholder wrapper in `SimpleCard.webflow.tsx` with Webflow declaration APIs.
- Authenticate and publish with `pnpm deploy` (or `pnpm deploy:ci` in CI).
