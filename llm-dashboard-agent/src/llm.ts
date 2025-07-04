import { ILLMResponse, NodeObject } from "./core";

export class LLM {
    constructor(public llmOptions: NodeObject) {

    }
    // TODO

    public async generate(prompt: unknown): Promise<ILLMResponse> {
        // TODO ...
        // const response = await openAI.chat.completions.create({ model: "gpt-4o", messages: [{role: "user", content: prompt}] });
        // const jsonRaw = response.choices[0].message.content;
        // return JSON.parse(jsonRaw);
        // "TODO: send to LLM for processing w/ " + prompt;
        return {
            success: true,
            text: "TODO: send to LLM for processing w/ " + prompt,
        }
    };
}