import type { DashboardIntent } from "./types";

/**
 * Calls the OpenAI Chat Completion API to analyze user input and return a structured DashboardIntent.
 */
export async function analyzeDashboardIntent(
  input: string,
  apiKey: string
): Promise<DashboardIntent> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that parses user input about dashboards and charts. " +
            "Return a JSON object following the predefined schema.",
        },
        { role: "user", content: input },
      ],
      temperature: 0,
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("No content in OpenAI API response.");
  }
  return parseIntentResponse(text);
}

/**
 * Parses a JSON string into a DashboardIntent.
 */
export function parseIntentResponse(text: string): DashboardIntent {
  return JSON.parse(text) as DashboardIntent;
}

if (require.main === module) {
  (async () => {
    const input = process.argv.slice(2).join(" ");
    if (!input) {
      console.error("Usage: node dist/index.js \"<user input>\"");
      process.exit(1);
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Please set OPENAI_API_KEY environment variable.");
      process.exit(1);
    }
    try {
      const intent = await analyzeDashboardIntent(input, apiKey);
      console.log(JSON.stringify(intent, null, 2));
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}