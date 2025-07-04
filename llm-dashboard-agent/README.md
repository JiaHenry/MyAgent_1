# llm-dashboard-agent

This package provides a TypeScript AI agent that analyzes free-form user input about dashboards and charts and returns a structured JSON representation of the user's intent using the OpenAI GPT-4 API.

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## CLI Usage

```bash
export OPENAI_API_KEY=your_api_key
node dist/src/index.js "Create a bar chart of sales by region and filter for region = 'East'"
```

## API Usage

```ts
import { analyzeDashboardIntent } from "./dist/src/index";
import type { DashboardIntent } from "./dist/src/types";

const intent: DashboardIntent = await analyzeDashboardIntent(
  "Create a bar chart of sales by region and filter for region = 'East'",
  process.env.OPENAI_API_KEY!
);
console.log(intent);
```